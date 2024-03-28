<script>
	import { graph, changeMode } from "../stores/graph";
	import { modals, getModal } from "../stores/modals";
	import { system, resetSystem } from "../stores/system";
	import { getNotificationsContext } from "svelte-notifications";
	import { edgeOptions } from "../stores/settings";

	const { addNotification } = getNotificationsContext();

	$: if(!$system.client) {
		$system.client = Date.now().toString();
	};

	$: if(!$system.socket) {
		connect();
	}

	function connect() {
		$system.socket = new WebSocket(`ws://${$system.url}/ws/${$system.client}`);
		// $system.socket = new WebSocket(`wss://${$system.url}/ws/${$system.client}`);
		$system.socket.onopen = function() {
			addNotification({
				position: 'top-left',
				messages: ['Connected to server'],
				type: 'success',
				removeAfter: 4000,
			});
		};
	}

	function waitForMessage() {
		return new Promise(async (resolve, reject) => {
			if (!$system.socket || $system.socket.readyState !== WebSocket.OPEN)
				reject(new Error('WebSocket connection not open'));

			$system.socket.onmessage = function(event) {
				resolve(event.data);
			};
    	});
	}

	function sendMessage(message) {
		if (!$system.socket || $system.socket.readyState !== WebSocket.OPEN) {
			addNotification({
				position: 'top-left',
				messages: ['Still connecting to server...'],
				type: 'error',
				header: 'Error starting simulation:',
				removeAfter: 2000,
			});
			connect();
			return;
		}
			
		$system.socket.send(message);
	}

	async function requestSimulation(message) {
		try {
			sendMessage(JSON.stringify(message));
			const response = await waitForMessage();
			return JSON.parse(response);
		} catch (error) {
			$system.running = false;
			$system.simulating = false;
		}
	}

	async function requestDetails(route, message) {
		let response = null;
		await fetch(`http://${$system.url}/${route}/${$system.client}`, {
		// await fetch(`https://${$system.url}/${route}/${$system.client}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(message)
		})
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.then(data => {
			response = data;
		})

		return response;
	}

	async function updateTime(time) {
		$system.time = time;
		$system.prev = time;	
	}
	
	export async function simulate() {
		toggleSimulation();
		while ($system.simulating) {
			await nextConfig();
		}
	}

	function toggleSimulation() {
		$system.simulating = !$system.simulating;

		if (!$system.simulating) {
			stopAllEdgeAnimation();
			$system.running = false;
		}
	}
	
	function triggerEdges(n) {
		const edges = [];
		$graph.getRelatedEdgesData(n, 'out').forEach((edge) => {
			edges.push(edge.id);
		});

		return edges;
	}

	function stopAllEdgeAnimation() {
		$graph.getAllEdgesData().forEach((edge) => {
			if ($graph.getItemState(edge.id, "Spiking"))
				$graph.setItemState(edge.id, "Spiking", false);
		});
	}

	function stopEdgeAnimation(edges) {
		$graph.setItemState(edges, "Spiking", false);
	}

	async function dummyAnimate() {
		return await new Promise((resolve) => {
			setTimeout(async() => {
				resolve();
			}, $system.tickRate);
		});
	}

	export async function animate(spike) {
		if(!$edgeOptions.animation.enabled) {
			return await dummyAnimate();
		}

		if($edgeOptions.animation.autoDisable) {
			if($system.edgeCount > $edgeOptions.animation.autoDisableCount) {
				return await dummyAnimate();
			}
		}

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

			$graph.setItemState(edges, "Spiking", true);

			setTimeout(async() => {
				resolve(stopEdgeAnimation(edges));
			}, $system.tickRate);
		});
	}

	async function getConfigMatrices() {
		const conf = getCurrentConfig();
		$system.matrices = await requestDetails(
			'matrices', { config: conf }
		);
	}

	async function generateInitialConfig() {
		console.log('Generating initial config');
		const nodes = $graph.getAllNodesData();
		const edges = $graph.getAllEdgesData();

		const data = await requestSimulation({
			type: "generate",
			NSNP: {
				neurons: nodes,
				syn: edges,
			}
		});
		
		$system.edgeCount = edges.length;
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

	function getCurrentConfig() {
		return $system.history[$system.time];
	}

	function updateGraphConfig(conf, mode='forward', step=1) {
		const updatedNodes = [];
		
		let curVar = 0;
		$system.order.nrn_ord.forEach((reg) => {
			const neuron = $graph.getNodeData(reg);
			let changed = false;
			neuron.data.var_.forEach((v, i) => {
				if (v[1] !== conf[curVar].toString()) {
					v[1] = conf[curVar].toString();
					changed = true;
				}
				curVar += 1;
			});

			if(changed) updatedNodes.push(neuron);
		});

		if (mode === 'backward') {
			$system.order.out_ord.forEach((out) => {
				const neuron = $graph.getNodeData(out);
				neuron.data.train = neuron.data.train.slice(0, neuron.data.train.length - step);
				updatedNodes.push(neuron);
			});
		}

		if (mode === 'forward') {
			let currentTime = $system.time;
			for (currentTime; currentTime < $system.time + step; currentTime++) {
				const env = $system.environment[currentTime + 1];
				$system.order.out_ord.forEach((out, index) => {
					const neuron = $graph.getNodeData(out);
					neuron.data.train.push(env[index].toString());
				});
			}
			$system.order.out_ord.forEach((out) => {
				const neuron = $graph.getNodeData(out);
				updatedNodes.push(neuron);
			});
		}

		$graph.updateData('node', updatedNodes);
	}

	async function nextFromHistory() {
		$system.running = true;
		const spike = $system.spike[$system.time + 1];
		await animate(spike);
		$system.running = false;
		jumpToConfig($system.time + 1);
	}

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

	function assignRandomSpikes() {
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

	function waitForGuidedSubmit() {
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

	async function nextConfig() {
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
			$system.history.push(next);
			$system.environment.push(env);
			$system.spike.push(spike);
			updateGraphConfig(next, 'forward', 1);
			updateTime($system.time + 1);
		}

		getConfigMatrices();

		// clean system details
		$system.config = {};
		$system.choice.active = [];
		$system.choice.spike = null;
		$system.choice.random = {};
		$system.running = false;
	}

	async function prevConfig(step=1) {
		if ($system.running) return;
		if ($system.time === 0 || $system.time - step < 0) return;

		$system.running = true;

		updateTime($system.time - step);
		const conf = getCurrentConfig();
		updateGraphConfig(conf, 'backward', step);

		getConfigMatrices();

		$system.running = false;
	}

	// function for simulation slider
	function jumpToConfig(time) {
		if ($system.running) return;
		$system.time = $system.prev;
		
		if (time < $system.time) {
			prevConfig($system.time - time);
		}
		
		else if (time > $system.time) {
			$system.running = true;
			const next = $system.history[time];
			updateGraphConfig(next, 'forward', time - $system.time);
			updateTime(time);
			$system.running = false;
		}
	}

	function resetConfig() {
		if ($system.simulating || $system.running) return;
		if (!$system.history.length) return;

		prevConfig($system.time);
		
		addNotification({
			position: 'top-left',
			messages: ['Double-click to hard-reset'],
			type: 'success',
			removeAfter: 2000,
		});
	}

	function resetSimulation() {
		if ($system.simulating || $system.running) return;
		jumpToConfig(0);
		resetSystem();
	}

	function safe(func) {
		return async function (...args) {
			try {
				if($system.dev) {
					const startTime = performance.now();
					const value = await func.apply(this, args);
					const endTime = performance.now();
					
					if(func.name === 'nextConfig' && $system.history.length - 1 === $system.time)
						console.log(`${func.name} took ${endTime - startTime - $system.tickRate}ms`);
					else
						console.log(`${func.name} took ${endTime - startTime}ms`);

					return value;
				}

				return func.apply(this, args);
			} catch (error) {
				console.error(error);
				$system.running = false;
				$system.simulating = false;
			}
		};
	}
	
	nextConfig = safe(nextConfig);
	prevConfig = safe(prevConfig);
	jumpToConfig = safe(jumpToConfig);
	resetConfig = safe(resetConfig);
	resetSimulation = safe(resetSimulation);

	export { nextConfig, prevConfig, jumpToConfig, resetConfig, resetSimulation };
</script>