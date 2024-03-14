import { nodeOptions } from '../stores/settings';
import { edgeOptions } from '../stores/settings';
import { edgeAnimation } from './animations/edge-animation';
import { nodeAnimation } from './animations/node-animation';
import { get } from 'svelte/store';

const DUMMY_NODE_ID = 'g6-create-edge-dummy-node';
const VIRTUAL_EDGE_ID = 'g6-create-edge-virtual-edge';

export const getNodeConfig = (nodeInnerModel) => {
	if (nodeInnerModel.id === DUMMY_NODE_ID) {
		return nodeInnerModel;
	}

	// Can preprocess the node here - downside is that it will be called for all node updates (i.e., dragging)
	// preprocessNode(nodeInnerModel); 
	const config = get(nodeOptions);
	const {data, ...newModel } = nodeInnerModel;
	const { size:[width, height] } = data;

	if (data.ntype === 'out') {
		return {
			...newModel,
			data: {
				...data,
				size: [width, height],
				type: 'neuron-node',
				keyShape: {
					width: width+config.outShape.padding*2,
					height: height+config.outShape.padding*2,
					fill: config.outShape.fill,
					stroke: config.outShape.stroke,
					lineWidth: config.outShape.lineWidth,
					radius: config.outShape.radius,
					cursor: 'pointer',
					zIndex: -3,
				},
				haloShape: {
					fill: config.haloShape.fill,
					stroke: config.haloShape.stroke,
				},
				otherShapes: {},
				animates: nodeAnimation(),
			},
		}
	}
	if(data.ntype === 'reg') {
		return {
			...newModel,
			data: {
				...data,
				size: [width, height],
				type: 'neuron-node',
				keyShape: {
					width: width+config.content.padding*2,
					height: height+config.content.padding*2,
					fill: config.keyShape.fill,
					stroke: config.keyShape.stroke,
					lineWidth: config.keyShape.lineWidth,
					cursor: 'pointer',
					radius: 15,
					zIndex: -3,
				},
				haloShape: {
					stroke: config.haloShape.stroke,
				},
				otherShapes: {},
				animates: nodeAnimation(),
			},
		};
	}
}

export const getEdgeConfig = (edgeInnerModel) => {
	const { id, data } = edgeInnerModel;

	if (id === VIRTUAL_EDGE_ID) {
		return edgeInnerModel;
	}

	const config = get(edgeOptions);
	
	return {
		id,
		data: {
			...data,
			keyShape: {
				stroke: config.keyShape.stroke,
				endArrow: config.endArrow,
				lineWidth: config.keyShape.lineWidth,
			},
			animates: edgeAnimation(),
		},
	};
}

export const nodeState = () => {}
export const edgeState = () => {
	const config = get(edgeOptions);
	return {
		Spiking: {
			otherShapes: {
				// growShape: {
				// 	visible: true,
				// 	lineWidth: config.growShape.lineWidth,
				// 	lineDash: config.growShape.lineDash,
				// 	stroke: config.growShape.stroke,
				// },
				// colorShape: {
				// 	visible: true,
				// 	stroke: config.colorShape.stroke,
				// 	lineWidth: config.colorShape.lineWidth,
				// },
				spikeShape: {
					visible: true,
					offsetDistance: 1,
				},
			},
		},
	}
}