import { Graph, Extensions, extend } from '@antv/g6';

class SynapseSingleEdge extends Extensions.LineEdge {
	afterDraw(model, shapeMap, diffData, diffState) {
		const { keyShape } = shapeMap;
		const { visible: spikeVisible, ...spikeStyles } = model.data?.otherShapes?.spikeShape || {};
		// const { visible: growVisible, ...growStyles } = model.data?.otherShapes?.growShape || {};
		// const { visible: colorVisible, ...colorStyles } = model.data?.otherShapes?.colorShape || {};

		const shapes = {};
		if(spikeVisible) {
			shapes.spikeShape = this.upsertShape(
				'circle',
				'spikeShape',
				{
					r: 4,
					x: 0,
					y: 0,
					fill : '#1e429f',
					offsetPath: keyShape,
					zIndex: 3,
					...spikeStyles,
				},
				{
					model,
					shapeMap,
					diffData,
					diffState,
				},
			)
		}

		// if(colorVisible) {
		// 	shapes.colorShape = this.upsertShape(
		// 		'line',
		// 		'colorShape',
		// 		{
		// 			...keyShape.attributes,
		// 			zIndex: 2,
		// 			...colorStyles,
		// 		},
		// 		{
		// 			model,
		// 			shapeMap,
		// 			diffData,
		// 			diffState,
		// 		}
		// 	)
		// }

		// if(growVisible) {
		// 	shapes.growShape = this.upsertShape(
		// 		'line',
		// 		'growShape',
		// 		{
		// 			...keyShape.attributes,
		// 			zIndex: 3,
		// 			...growStyles,
		// 		},
		// 		{
		// 			model,
		// 			shapeMap,
		// 			diffData,
		// 			diffState,
		// 		}
		// 	)
		// }

		return shapes;
	}
}

class SynapseEdge extends Extensions.QuadraticEdge {
	afterDraw(model, shapeMap, diffData, diffState) {
		const { keyShape } = shapeMap;
		const { visible: spikeVisible, ...spikeStyles } = model.data?.otherShapes?.spikeShape || {};
		// const { visible: growVisible, ...growStyles } = model.data?.otherShapes?.growShape || {};
		// const { visible: colorVisible, ...colorStyles } = model.data?.otherShapes?.colorShape || {};

		const shapes = {}
		if(spikeVisible) {
			shapes.spikeShape = this.upsertShape(
				'circle',
				'spikeShape',
				{
					r: 4,
					x: 0,
					y: 0,
					fill : '#1e429f',
					offsetPath: keyShape,
					zIndex: 3,
					...spikeStyles,
				},
				{
					model,
					shapeMap,
					diffData,
					diffState,
				},
			)
		}

		// if(colorVisible) {
		// 	shapes.colorShape = this.upsertShape(
		// 		'path',
		// 		'colorShape',
		// 		{
		// 			...keyShape.attributes,
		// 			zIndex: 2,
		// 			...colorStyles,
		// 		},
		// 		{
		// 			model,
		// 			shapeMap,
		// 			diffData,
		// 			diffState,
		// 		}
		// 	)
		// }

		// if(growVisible) {
		// 	shapes.growShape = this.upsertShape(
		// 		'path',
		// 		'growShape',
		// 		{
		// 			...keyShape.attributes,
		// 			zIndex: 2,
		// 			...growStyles,
		// 		},
		// 		{
		// 			model,
		// 			shapeMap,
		// 			diffData,
		// 			diffState,
		// 		}
		// 	)
		// }

		return shapes;
	}
}



export { SynapseEdge, SynapseSingleEdge };