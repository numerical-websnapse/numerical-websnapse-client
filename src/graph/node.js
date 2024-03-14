import { Extensions } from '@antv/g6';
import { nodeOptions } from '../stores/settings';
import { getImage } from '../stores/data';
import { get } from 'svelte/store';

class NeuronNode extends Extensions.RectNode {
	drawOtherShapes(model, shapeMap, diffData, diffState) {
		const config = get(nodeOptions);
		
        const { id, data: cfg } = model;
		const { keyShape } = shapeMap;
		
        const keyShapeBBox = keyShape.getLocalBounds();
        const   x = -keyShapeBBox.halfExtents[0],
            	y = -keyShapeBBox.halfExtents[1];

		const [width, height] = cfg.size ? cfg.size : [200, 100];

		const {
			haloShape: haloShapeStyle,
			keyShape: keyShapeStyle 
		} = this.mergedStyles;

        const otherShapes = {};

		const img = getImage(id);
		const [ imgLbl, widthLbl, heightLbl ] = img.label;

		otherShapes['label-shape'] = this.upsertShape(
			'image',
			'label-shape',
			{
				x:x-config.label.offset,
				y:y-config.label.offset,
				width: widthLbl,
				height: heightLbl,
				img: imgLbl,
				zIndex: -2,
				draggable: false,
			},
			{
				model,
				shapeMap,
				diffData,
				diffState,
			},
		);

		if (cfg.ntype === 'out') {
			const [ imgTrn, widthTrn, heightTrn ] = img.train;
			
			otherShapes['inner-keyshape'] = this.upsertShape(
				'rect',
				'inner-keyshape',
				{
					x: x + config.outShape.padding / 2,
					y: y + config.outShape.padding / 2,
					width: width + config.outShape.padding,
					height: height + config.outShape.padding,
					radius: config.outShape.radius-5,
					fill: config.outShape.fill,
					stroke: config.outShape.stroke,
					lineWidth: config.outShape.lineWidth,
					cursor: 'pointer',
					draggable: true,
					zIndex: -2,
				},
				{
					model,
					shapeMap,
					diffData,
					diffState,
				}
			);

			otherShapes['train-shape'] = this.upsertShape(
				'image',
				'train-shape',
				{
					x:x+(width-widthTrn)/2 + config.outShape.padding,
					y:y+(height-heightTrn)/2 + config.outShape.padding,
					width: widthTrn,
					height: heightTrn,
					img: imgTrn,
					cursor: 'pointer',
					draggable: true,
					zIndex: -1,
				},
				{
					model,
					shapeMap,
					diffData,
					diffState,
				}
			);

			return otherShapes;
		}
		

		if (cfg.ntype === 'reg') {
			const [ imgPrf, widthPrf, heightPrf ] = img.prf;
			const [ imgVar, widthVar, heightVar ] = img.var;

			otherShapes['func-shape'] = this.upsertShape(
				'image',
				'func-shape',
				{
					x:x+(width-widthPrf)/2 + config.content.padding,
					y:y+config.content.divider+heightVar+config.content.padding,
					width: widthPrf,
					height: heightPrf,
					img: imgPrf,
					cursor: 'pointer',
					draggable: true,
					zIndex: -2,
				},
				{
					model,
					shapeMap,
					diffData,
					diffState,
				},
			);
			
			otherShapes['var-shape'] = this.upsertShape(
				'image',
				'var-shape',
				{
					x:x+(width-widthVar)/2+config.content.padding,
					y:y+config.content.padding,
					width: widthVar,
					height: heightVar,
					img: imgVar,	
					cursor: 'pointer',
					draggable: true,
					zIndex: -2,
				},
				{
					model,
					shapeMap,
					diffData,
					diffState,
				},
			);
		}
		
        return otherShapes;
    }
}

export { NeuronNode };