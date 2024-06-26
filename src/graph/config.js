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

	const {data, ...newModel } = nodeInnerModel;
	const config = get(nodeOptions);

	if(data.type === 'reg') {
		return {
			...newModel,
			data: {
				...data,
				keyShape: {
					fill: config.keyShape.fill,
					stroke: config.keyShape.stroke,
					lineWidth: config.keyShape.lineWidth,
					radius: config.keyShape.radius,
					cursor: 'pointer',
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

	if (data.type === 'out') {
		return {
			...newModel,
			data: {
				...data,
				keyShape: {
					fill: config.outShape.fill,
					stroke: config.outShape.stroke,
					lineWidth: config.outShape.lineWidth,
					radius: config.outShape.radius,
					cursor: 'pointer',
					zIndex: -3,
				},
				haloShape: {
					stroke: config.haloShape.stroke,
				},
				otherShapes: {},
				animates: nodeAnimation(),
			},
		}
	}

	if (data.type === 'in') {
		return {
			...newModel,
			data: {
				...data,
				keyShape: {
					fill: config.inShape.fill,
					stroke: config.inShape.stroke,
					lineWidth: config.inShape.lineWidth,
					radius: config.inShape.radius,
					cursor: 'pointer',
					zIndex: -3,
				},
				haloShape: {
					stroke: config.haloShape.stroke,
				},
				otherShapes: {},
				animates: nodeAnimation(),
			},
		}
	}
}

export const getEdgeConfig = (edgeInnerModel) => {
	const config = get(edgeOptions);

	if (edgeInnerModel.id === VIRTUAL_EDGE_ID) {
		edgeInnerModel.data.keyShape.stroke = config.keyShape.stroke;
		edgeInnerModel.data.keyShape.endArrow.stroke = config.endArrow.stroke;
		edgeInnerModel.data.keyShape.endArrow.fill = config.endArrow.fill;

		return edgeInnerModel;
	}

	const { id, data } = edgeInnerModel;
	
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
				// keyShape: {
				// 	lineWidth: 2,
				// 	lineDash: [2, 2],
				// },
				spikeShape: {
					r: config.spikeShape.r,
					fill: config.spikeShape.fill,
					offsetDistance: 1,
					visible: true,
				},
			},
		},
	}
}