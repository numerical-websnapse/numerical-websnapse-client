import G6, { Extensions } from "@antv/g6";
import { graphOptions, dark } from "../stores/settings";
import { get } from 'svelte/store';

// Models
import { NeuronNode } from './node';
import { SynapseEdge, SynapseSingleEdge } from './edge';

// Plugins
import { contextMenuCanvas } from './plugins/context-menu';
import { contextMenuNode } from './plugins/context-menu';
import { contextMenuEdge } from './plugins/context-menu';
import { lodController } from "./plugins/lod-controller";
import { minimap } from './plugins/minimap';

// Behaviors
import { deleteClick } from './behaviors/delete-click';
import { editNodeClick } from './behaviors/edit-node';
import { createNodeClick } from './behaviors/create-node';

// Actions
import { removeEdge } from './actions/edge-action';

// Config
import { getEdgeConfig } from './config';
import { getNodeConfig } from './config';
import { nodeState } from './config';
import { edgeState } from './config';

// Layout
import { InitLayout } from './layouts/init-layout';

// Local Storage
import { setPositionLocalData, setGraphLocalData } from '../stores/graph';

const isDark = get(dark);
const { themes, grids } = get(graphOptions);
const theme = isDark ? themes.dark : themes.light;
const grid = isDark ? grids.dark : grids.light;

/**
 * Extends the G6.Graph class to include custom nodes, edges, behaviors, and plugins.
 * @param {string} container - The container element for the graph.
 * @param {object} size - The size of the graph.
 * @param {object} data - The data to be rendered in the graph.
 * 	@prop {object} nodes - The nodes to be rendered in the graph.
 * 	@prop {object} edges - The edges to be rendered in the graph.
 * @param {string} renderer - The renderer to be used for the graph.
 * @returns {object} - The graph object.
 */
const ExtGraph = G6.extend(G6.Graph, {
	nodes: {
	  'neuron-node': NeuronNode,
	},
	edges: {
		'line-edge': SynapseSingleEdge,
		'quadratic-edge': SynapseEdge,
	},
	behaviors: {
	  'brush-select': G6.Extensions.BrushSelect,
	  'create-edge': G6.Extensions.CreateEdge,
	  'hover-activate': G6.Extensions.HoverActivate,
	  'delete-click': deleteClick,
	  'edit-node': editNodeClick,
	  'create-node': createNodeClick,
	},
	transforms: {
		'process-parallel-edges': G6.Extensions.ProcessParallelEdges,
	},
	plugins: {
		'menu': G6.Extensions.Menu,
		'minimap': G6.Extensions.Minimap,
		'grid': G6.Extensions.Grid,
	},
	layouts: {
		'init': InitLayout,
		'radial': Extensions.RadialLayout,
		'mds': Extensions.MDSLayout,
	}
})

/**
 * Renders the graph.
 * 		- The graph is rendered with the specified container, size, data, and renderer.
 * @param {string} container - The container element for the graph.
 * @param {object} size - The size of the graph.
 * @param {object} data - The data to be rendered in the graph.
 * 	@prop {object} nodes - The nodes to be rendered in the graph.
 * 	@prop {object} edges - The edges to be rendered in the graph.
 * @param {string} renderer - The renderer to be used for the graph.
 * @returns {object} - The graph object.
 * @example
 * const graph = renderGraph(container, size, data, renderer);
 * graph.render();
*/
const renderGraph = (container, size, data, renderer) => {
	const graph = new ExtGraph({
		container,
		renderer,
		data: data,
		width: size.width,
		height: size.height,
		node: getNodeConfig,
		edge: getEdgeConfig,
		nodeState: nodeState(),
		edgeState: edgeState(),
		autoFit: 'view',
		fitCenter: true,
		/**
		 * There is a bug in the current g6 version that requires the layout to be set first before it can be changed
		 * or possibly from svelte store to g6 classes
		 * @prop {string} type - The type of layout to be used for the graph.
		 * NOTE: This is a temporary fix and should be removed once the bug is fixed.
		 * NOTE: This returns the specified node positions and edges in the graph from input data.
		*/
		layout : {
			type: 'init',
		},
		/**
		 * The enabled modes for the graph.
		 * @prop {string} default - The default mode for the graph.
		 * @prop {string} move - The mode for moving the graph.
		 * @prop {string} delete - The mode for deleting elements in the graph.
		 * @prop {string} edit - The mode for editing nodes in the graph.
		 * @prop {string} create-node - The mode for creating nodes in the graph.
		 * @prop {string} create-edge - The mode for creating edges in the graph.
		 */
		modes: {
			default: [
				'drag-canvas',
				'zoom-canvas',
				{
					key: 'drag-node',
					type: 'drag-node',
					eventName: 'ondropnode',
					enableTransient: true,
				},
				'click-select',
				'brush-select',
				'hover-activate',
			],
			move: [
				'drag-canvas',
				'zoom-canvas',
			],
			delete: [
				'drag-canvas',
				'zoom-canvas',
				'delete-click',
				'hover-activate',
			],
			edit: [
				'drag-canvas',
				'zoom-canvas',
				'hover-activate',
				'edit-node',
			],
			'create-node': [
				'drag-canvas',
				'zoom-canvas',
				'create-node',
			],
			'create-edge': [
				'drag-canvas',
				'zoom-canvas',
				{
					key: 'create-edge-click-key',
					type: 'create-edge',
					trigger: 'click',
					edgeConfig: { 
						keyShape: { 
							stroke: '#000000',
							lineDash: [5, 5],
							endArrow: {
								path: 'M 0,0 L 12,6 L 9,0 L 12,-6 Z',
								fill: '#000000',
								stroke: '#000000',
							},
						} 
					},
					createVirtualEventName: 'begincreate',
					createActualEventName: 'aftercreate',
					cancelCreateEventName: 'cancelcreate',
					shouldBegin: (e) => {
						const node = graph.getNodeData(e.itemId);
						if (node.data.ntype === 'out') {
							return false;
						}
						return true;
					},
				},
				{
					key: 'create-edge-drag-key',
					type: 'create-edge',
					trigger: 'drag',
					edgeConfig: { 
						keyShape: { 
							stroke: '#000000',
							lineDash: [5, 5],
							endArrow: {
								path: 'M 0,0 L 12,6 L 9,0 L 12,-6 Z',
								fill: '#000000',
								stroke: '#000000',
							},
						} 
					},
					createVirtualEventName: 'begincreate',
					createActualEventName: 'aftercreate',
					cancelCreateEventName: 'cancelcreate',
					shouldBegin: (e) => {
						const node = graph.getNodeData(e.itemId);
						if (node.data.ntype === 'out') {
							return false;
						}

						return true;
					},
				},
			],
		},
		/**
		 * The enabled transforms for items in the graph
		 * @prop {string} type - The type of transform to be applied to the graph.
		 * @prop {string} multiEdgeType - The type of edge to be used for multiple edges.
		 * @prop {number} offsetDiff - The offset difference for the transform.
		 */
		transforms: [
			{
				type: 'process-parallel-edges',
				multiEdgeType: 'quadratic-edge',
				offsetDiff: 30,
			},
		],
		/**
		 * The enabled plugins for the graph.
		 * @prop {string} type - The type of plugin to be used for the graph.
		 * @prop {string} key - The key for the plugin to be used for the graph.
		 */
		plugins: [
			contextMenuCanvas,
			contextMenuNode,
			contextMenuEdge,
			lodController,
			minimap(data.edges.length),
			grid,
		],
		// enableStack: false,
		stackCfg: {
			stackActive: false,
		},
		optimize: {
			tileFirstRender: true,
			tileFirstRenderSize: 20,
			// tileBehavior: true,
			// tileBehaviorSize: 100,
			// tileLodSize: 10,
		},
		theme: theme,
	});

	graph.on('begincreate', (e) => {
		graph.setCursor('crosshair');
	  });

	graph.on('cancelcreate', (e) => {
		graph.setCursor('default');
		graph.updatePlugin(minimap(
			graph.getAllEdgesData().length
		));
	});

	graph.on('aftercreate', (e) => {
		graph.getAllEdgesData().forEach((edge) => {
			if(edge.source === edge.target) {
				removeEdge(edge.id, graph);
			}

			if(edge.id === e.edge.id) return;
			if(edge.source === e.edge.source && edge.target === e.edge.target) {
				removeEdge(edge.id, graph);
			}
		});
		
		setGraphLocalData();
	});

	graph.on('ondropnode', (e) => {
		setPositionLocalData();
	});
	
	return graph;
}

export { ExtGraph, renderGraph };