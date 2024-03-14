<script>
	import { updateNode } from "../graph/actions/node-action";
	import { modals, getModal } from "../stores/modals";
	import { system, resetSystem } from "../stores/system";
	import { graph, changeMode } from "../stores/graph";
	import { deepCopy } from "../utils/copy";

	var client_id = Date.now()
	let socket = new WebSocket(`ws://numerical-websnapse-server.onrender.com:8000/ws/${client_id}`);

	function connect() {
		socket = new WebSocket(`ws://numerical-websnapse-server.onrender.com:8000/ws/${client_id}`);
	}

	socket.onopen = function() {
		console.log('Connected to the server');
	};

	function waitForMessage() {
		return new Promise((resolve, reject) => {
			if (!socket || socket.readyState !== WebSocket.OPEN) {
				reject(new Error('WebSocket connection not open'));
				connect();
				return;
			}

			socket.onmessage = function(event) {
				resolve(event.data);
			};
    	});
	}

	function sendMessage(message) {
		if (!socket || socket.readyState !== WebSocket.OPEN)
			connect();

		socket.send(message);
	}

	async function requestSimulation(message) {
			try {
				sendMessage(JSON.stringify(message));
				const response = await waitForMessage();
				return JSON.parse(response);
			} catch (error) {
				$system.running = false;
				$system.simulating = false;
				console.error("Error:", error);
			}
		}

	export async function updateTime(time) {
		$system.time = time;
		$system.prev = time;
		
	}
	
	export async function simulate() {
		toggleSimulation();
		while ($system.simulating) {
			await nextConfig();
		}
	}

	export function toggleSimulation() {
		$system.simulating = !$system.simulating;

		if (!$system.simulating) {
			stopAllEdgeAnimation();
			$system.running = false;
		}
	}

	export function simulationEnd() {
		return $system.time === $system.history.length - 1;
	}

	export function triggerEdges(n) {
		const edges = [];
		$graph.getRelatedEdgesData(n, 'out').forEach((edge) => {
			$graph.setItemState(edge.id, "Spiking", true);
			edges.push(edge.id);
		});

		return edges;
	}

	export function stopAllEdgeAnimation() {
		$graph.getAllEdgesData().forEach((edge) => {
			if ($graph.getItemState(edge.id, "Spiking"))
				$graph.setItemState(edge.id, "Spiking", false);
		});
	}

	export function stopEdgeAnimation(edges) {
		edges.forEach((id) => {
			$graph.setItemState(id, "Spiking", false);
		});
	}

	export async function animate(spike) {
		return await new Promise((resolve) => {
			const edges = [];
			let curPrf = 0;
			$system.order.nrn_ord.forEach((n) => {
				const neuron = $graph.getNodeData(n);
				const func_count = neuron.data.prf.length;
				for (let i = 0; i < func_count; i++) {
					if (spike[curPrf + i] === 1) {
						edges.push(...triggerEdges(n));
						break;
					}
				}
				curPrf += func_count;
			});

			setTimeout(async() => {
				resolve(stopEdgeAnimation(edges));
			}, $system.tickRate);
		});
	}

	export function getConfigDetails(conf) {
		return requestSimulation({
			type: "config",
			config: conf
		});
	}

	export async function getConfigMatrices() {
		const conf = getCurrentConfig();
		$system.matrices = await requestSimulation({
			type: "matrices",
			config: conf
		});
	}

	export function getGraphConfig() {
		const config = [];
		$system.order.nrn_ord.forEach((n) => {
			const neuron = $graph.getNodeData(n);
			neuron.data.var_.forEach((v) => {
				config.push(parseFloat(v[1]));
			});
		});
		return config;
	}

	export async function generateInitialConfig() {
		console.log('Generating initial config');
		const data = await requestSimulation({
			type: "generate",
			NSNP: {
				neurons: $graph.getAllNodesData(),
				syn: $graph.getAllEdgesData(),
			}
		});
		const { nodes: treeNodes, nrn_ord, out_ord } = data;
		$system.order = { nrn_ord, out_ord };
		$system.history = [treeNodes[0].conf];
		$system.environment = [null];
		$system.spike = [null];
		$system.choice.random = nrn_ord.reduce((choice, neuron) => {
			choice[neuron] = 0;
			return choice;
		}, {});
		changeMode('move');
		console.log('Initial config generated');
	}

	export function getInitialConfig() {
		return $system.history[0];
	}

	export function getCurrentConfig() {
		return $system.history[$system.time];
	}

	export function updateGraphConfig(conf, env=null, mode='forward', step=undefined) {
		let curVar = 0;
		$system.order.nrn_ord.forEach((n) => {
			let changed = false;
			const neuron = $graph.getNodeData(n);
			neuron.data.var_.forEach((v, i) => {
				if (v[1] !== conf[curVar].toString()) {
					v[1] = conf[curVar].toString();
					curVar += 1;
					changed = true;
				}
			});
			if(changed) updateNode(n, neuron, $graph, true);
		});

		if (mode === 'backward') {
			$system.order.out_ord.forEach((out) => {
				const neuron = $graph.getNodeData(out);
				neuron.data.train = neuron.data.train.slice(0, neuron.data.train.length - step);
				updateNode(out, neuron, $graph, true);
			});
		}

		if(!env) return;

		if (mode === 'forward') {
			let curOut = 0;
			$system.order.out_ord.forEach((out) => {
				const neuron = $graph.getNodeData(out);
				neuron.data.train.push(env[curOut].toString());
				updateNode(out, neuron, $graph, true);
				curOut += 1;
			});
		}
	}

	export async function nextFromHistory() {
		$system.running = true;
		const spike = $system.spike[$system.time + 1];
		await animate(spike);
		$system.running = false;
		jumpToConfig($system.time + 1);
	}

	/*
	 * after porting to a websocket solution for the backend, change this to request directly from the socket
	 */
	async function computeActive(config) {
		$system.choice.active = await requestSimulation({
			type: "active",
			config: config
		});

		$system.choice.spike = await requestSimulation({
			type: "spike",
			config: config
		});
	};

	export function assignRandomSpikes() {
		let curPrf = 0;
		
		$system.order.nrn_ord.forEach((n) => {
			const neuron = $graph.getNodeData(n);
			const prfCount = neuron.data.prf.length;

			if (!$system.choice.random[n]) {
				curPrf += prfCount;
				return;
			}

			const active = $system.choice.active.reduce((acc, curr, index) => {
				if (curr === 1 && (index >= curPrf && index < curPrf + prfCount)) acc.push(index-curPrf);
				return acc;
			}, []);
			const random = active[Math.floor(Math.random() * active.length)];

			for (let i = 0; i < prfCount; i++) {
				if (i===random) $system.choice.spike[curPrf + i] = 1;
				else $system.choice.spike[curPrf + i] = 0;
			}

			curPrf += prfCount;
		});
	}

	export function waitForGuidedSubmit() {
		return new Promise((resolve) => {
			const submitButton = document.getElementById($modals.guided.submitButton);
			const cancelButtons = document.getElementsByClassName($modals.guided.cancelButton);
			const buttons = Array.from(cancelButtons).concat([submitButton]);
			const listeners = [];

			const cleanup = () => {
				listeners.forEach(({ button, clickHandler }) => {
					button.removeEventListener('click', clickHandler);
				});
			};

			buttons.forEach((button) => {
				const clickHandler = (e) => {
					cleanup();
					if (e.target.id === $modals.guided.submitButton) {
						assignRandomSpikes();
						resolve();
					} else {
						$system.guided = false;
						resolve();
					}
				};

				button.addEventListener('click', clickHandler);
				listeners.push({ button, clickHandler });
			});
		});
	}

	export async function nextConfig() {
		if ($system.running) return;
		$system.running = true;

		if ($system.history.length - 1 > $system.time) {
			$system.running = false;
			if ($system.simulating) jumpToConfig($system.history.length - 1);
			else await nextFromHistory();
			getConfigMatrices();
			return;
		}

		let conf = getCurrentConfig();

		if (!conf) {
			await generateInitialConfig();
			conf = getCurrentConfig();
		};

		if($system.guided) {
			await computeActive(conf);
			getModal('guidedModal').show();
			await waitForGuidedSubmit();
		}

		$system.config = await requestSimulation({
			type: "next",
			config: conf,
			spike: $system.choice.spike,
		});

		const next = $system.config.next;
		const env = $system.config.env;
		const spike = $system.config.spike;
		
		await animate(spike);

		if ($system.running) {
			updateGraphConfig(next, env);
			$system.history.push(next);
			$system.environment.push(env);
			$system.spike.push(spike);
			updateTime($system.time + 1);
		}

		await getConfigMatrices();

		// clean system details
		$system.config = {};
		$system.choice.active = [];
		$system.choice.spike = null;
		$system.choice.random = {};
		$system.running = false;
	}

	export async function prevConfig(step=1) {
		if ($system.running) return;
		if ($system.time === 0 || $system.time - step < 0) return;

		$system.running = true;

		updateTime($system.time - step);
		const conf = getCurrentConfig();
		updateGraphConfig(conf, null, 'backward', step);

		getConfigMatrices();

		$system.running = false;
	}

	// function for simulation slider
	export function jumpToConfig(time) {
		if ($system.running) return;
		$system.time = $system.prev;
		
		if (time < $system.time) {
			prevConfig($system.time - time);
		}
		
		else if (time > $system.time) {
			$system.running = true;
			const next = $system.history[time];
			for (let i = $system.time; i < time; i++) {
				const env = $system.environment[i+1];
				let curOut = 0;
				$system.order.out_ord.forEach((out) => {
					const neuron = $graph.getNodeData(out);
					neuron.data.train.push(env[curOut].toString());
					updateNode(out, neuron, $graph, true);
					curOut += 1;
				});
			}
			updateGraphConfig(next);
			updateTime(time);
			$system.running = false;
		}
	}

	export function resetConfig() {
		if ($system.simulating) return;
		prevConfig($system.time);
	}

	export function resetSimulation() {
		if ($system.simulating || $system.running) return;
		jumpToConfig(0);
		resetSystem();
	}
</script>