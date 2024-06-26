import { Extensions } from '@antv/g6';
import { unicodeFormatter } from './utils/format';
import { nodeOptions } from '../stores/settings';
import { texFormatter } from './utils/format';
import { MathToImg } from '../utils/math';
import { get } from 'svelte/store';

let config = get(nodeOptions);

/**
 * Custom node for regular neurons
 * @class RegularNeuron
 * @extends Extensions.RectNode
 * @constructor
 * @param {object} model - The model for the node.
 * @param {object} shapeMap - The shape map for the node.
 * @param {object} diffData - The diff data for the node.
 * @param {object} diffState - The diff state for the node.
 * @returns {object} - The custom node object.
 */

class RegularNeuron extends Extensions.RectNode {
	drawOtherShapes(model, shapeMap, diffData, diffState) {
		config = get(nodeOptions);
		if(config.draw.mode === 'text')
			return this.drawModeText(model, shapeMap, diffData, diffState);
		if(config.draw.mode === 'simple')
			return this.drawModeSimple(model, shapeMap, diffData, diffState);
		if(config.draw.mode === 'image')
			return this.drawModeImages(model, shapeMap, diffData, diffState);
    }

	afterDraw(model, shapeMap, diffData, diffState) {
		const { keyShape, haloShape } = shapeMap;
		
		if(haloShape) {
			haloShape.attr({
				width: keyShape.attr('width'),
				height: keyShape.attr('height'),
			});
		}
	}

	/**
	 * draw the node in text mode -> renders node details as unicode mathemtical expressions
	 * @param {*} model 
	 * @param {*} shapeMap 
	 * @param {*} diffData 
	 * @param {*} diffState 
	 * @returns 
	 */
	drawModeText(model, shapeMap, diffData, diffState) {
        const { data: cfg } = model;
		const { keyShape } = shapeMap;
		
        const keyShapeBBox = keyShape.getLocalBounds();
        const   x = -keyShapeBBox.halfExtents[0],
            	y = -keyShapeBBox.halfExtents[1];

        const otherShapes = {};

		otherShapes['label-shape'] = this.upsertShape(
			'text',
			'label-shape',
			{
				x:x-config.label.offset,
				y:y-config.label.offset,
				text: unicodeFormatter(cfg.label, 'label'),
				fontFamily: 'Computer Modern',
				fill: config.content.fill,
				textAlign: 'left',
          		textBaseline: 'top',
				fontSize: 18,
				zIndex: -2,
				draggable: true,
			},
			{
				model,
				shapeMap,
				diffData,
				diffState,
			},
		);
		
		otherShapes['func-shape'] = this.upsertShape(
			'text',
			'func-shape',
			{
				text: unicodeFormatter(cfg.prf, 'prf'),
				fontFamily: 'Computer Modern',
				fill: config.content.fill,
				textAlign: 'left',
				textBaseline: 'top',
				fontSize: 18,
				zIndex: -2,
				cursor: 'pointer',
				draggable: true,
			},
			{
				model,
				shapeMap,
				diffData,
				diffState,
			},
		);
		
		otherShapes['var-shape'] = this.upsertShape(
			'text',
			'var-shape',
			{
				text: unicodeFormatter(cfg.var_, 'var'),
				fontFamily: 'Computer Modern',
				fill: config.content.fill,
				textAlign: 'left',
				textBaseline: 'top',
				fontSize: 18,
				zIndex: -2,
				cursor: 'pointer',
				draggable: true,
			},
			{
				model,
				shapeMap,
				diffData,
				diffState,
			},
		);

		const varBBox = otherShapes['var-shape'].getBBox();
		const prfBBox = otherShapes['func-shape'].getBBox();

		const width = Math.max(varBBox.width, prfBBox.width);
		const height = cfg.prf.length 
						? varBBox.height + prfBBox.height + config.content.divider
						: varBBox.height;

		keyShape.attr({
			width: width + config.content.padding*2,
			height: height + config.content.padding*2,
		});

		otherShapes['func-shape'].attr({
			x: x + (width-prfBBox.width)/2 + config.content.padding,
			y: y + config.content.divider + varBBox.height + config.content.padding,
		});

		otherShapes['var-shape'].attr({
			x: x + (width-varBBox.width)/2 + config.content.padding,
			y: y + config.content.padding,
		});
		
        return otherShapes;
	}

	/**
	 * Draw the node in simple mode -> only shows the variable values
	 * @param {*} model 
	 * @param {*} shapeMap 
	 * @param {*} diffData 
	 * @param {*} diffState 
	 * @returns 
	 */
	drawModeSimple(model, shapeMap, diffData, diffState) {
		const { keyShape } = shapeMap;
		const { id, data: cfg } = model;

		const keyShapeBBox = keyShape.getLocalBounds();
        const   x = -keyShapeBBox.halfExtents[0],
            	y = -keyShapeBBox.halfExtents[1];

		const otherShapes = {};

		otherShapes['label-shape'] = this.upsertShape(
			'text',
			'label-shape',
			{
				x:x-config.label.offset,
				y:y-config.label.offset,
				text: unicodeFormatter(cfg.label, 'label'),
				fontFamily: 'Computer Modern',
				fill: config.content.fill,
				textAlign: 'left',
          		textBaseline: 'top',
				fontSize: 18,
				zIndex: -2,
				draggable: true,
			},
			{
				model,
				shapeMap,
				diffData,
				diffState,
			},
		);
		
		// treat the variable values as train values
		otherShapes['var-shape'] = this.upsertShape(
			'text',
			'var-shape',
			{
				text: unicodeFormatter(cfg.var_.map((v)=>v[1]), 'train', {
					row: 3,
				}),
				fontFamily: 'Computer Modern',
				fill: config.content.fill,
				textAlign: 'left',
				textBaseline: 'top',
				fontSize: 18,
				zIndex: -2,
				cursor: 'pointer',
				draggable: true,
			},
			{
				model,
				shapeMap,
				diffData,
				diffState,
			},
		);

		const varBBox = otherShapes['var-shape'].getBBox();
		
		const width = Math.max(varBBox.width, config.keyShape.defaultWidth);
		const height = Math.max(varBBox.height, config.keyShape.defaultHeight);

		keyShape.attr({
			width: 	width + config.content.paddingSimple*2,
			height: height + config.content.paddingSimple*2,
		});

		otherShapes['var-shape'].attr({
			x: x + (width-varBBox.width)/2 + config.content.paddingSimple,
			y: y + (height-varBBox.height)/2 + config.content.paddingSimple,
		});

		return otherShapes;
	}

	/**
	 * draw the node in image mode -> renders node details as images
	 * @param {*} model 
	 * @param {*} shapeMap 
	 * @param {*} diffData 
	 * @param {*} diffState 
	 * @returns 
	 */
	drawModeImages(model, shapeMap, diffData, diffState) {
        const { id, data: cfg } = model;
		const { keyShape } = shapeMap;
		
        const keyShapeBBox = keyShape.getLocalBounds();
        const   x = -keyShapeBBox.halfExtents[0],
            	y = -keyShapeBBox.halfExtents[1];

        const otherShapes = {};

		const [ imgLbl, widthLbl, heightLbl ] = MathToImg(cfg.label, config.content.fill);

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
				draggable: true,
			},
			{
				model,
				shapeMap,
				diffData,
				diffState,
			},
		);

		const latexVar = texFormatter(cfg.var_, 'var');
		const latexPrf = texFormatter(cfg.prf, 'prf');

		const [ imgPrf, widthPrf, heightPrf ] = MathToImg(latexPrf, config.content.fill);
		const [ imgVar, widthVar, heightVar ] = MathToImg(latexVar, config.content.fill);

		const width = Math.max(widthPrf, widthVar);
		const height = cfg.prf.length 
						? heightPrf + heightVar + config.content.divider 
						: heightVar;

		keyShape.attr({
			width: width + config.content.padding*2,
			height: height + config.content.padding*2,
		});

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
		
        return otherShapes;
	}
}

/**
 * Custom node for output neurons
 * @class OutputNeuron
 * @extends Extensions.RectNode
 * @constructor
 * @param {object} model - The model for the node.
 * @param {object} shapeMap - The shape map for the node.
 * @param {object} diffData - The diff data for the node.
 * @param {object} diffState - The diff state for the node.
 * @returns {object} - The custom node object.
 */

class OutputNeuron extends Extensions.RectNode {
	drawOtherShapes(model, shapeMap, diffData, diffState) {
		config = get(nodeOptions);
		if(config.draw.mode === 'text')
			return this.drawModeText(model, shapeMap, diffData, diffState);
		if(config.draw.mode === 'simple')
			return this.drawModeSimple(model, shapeMap, diffData, diffState);
		if(config.draw.mode === 'image')
			return this.drawModeImages(model, shapeMap, diffData, diffState);
	}

	afterDraw(model, shapeMap, diffData, diffState) {
		const { keyShape, haloShape } = shapeMap;
		
		if(haloShape) {
			haloShape.attr({
				width: keyShape.attr('width'),
				height: keyShape.attr('height'),
			});
		}
	}

	/**
	 * draw the node in text mode -> renders node details as unicode mathemtical expressions
	 * @param {*} model 
	 * @param {*} shapeMap 
	 * @param {*} diffData 
	 * @param {*} diffState 
	 * @returns 
	 */
	drawModeText(model, shapeMap, diffData, diffState) {
        const { data: cfg } = model;
		const { keyShape } = shapeMap;
		
        const keyShapeBBox = keyShape.getLocalBounds();
        const   x = -keyShapeBBox.halfExtents[0],
            	y = -keyShapeBBox.halfExtents[1];

        const otherShapes = {};

		otherShapes['label-shape'] = this.upsertShape(
			'text',
			'label-shape',
			{
				x:x-config.label.offset,
				y:y-config.label.offset,
				text: unicodeFormatter(cfg.label, 'label'),
				fontFamily: 'Computer Modern',
				fill: config.content.fill,
				textAlign: 'left',
          		textBaseline: 'top',
				fontSize: 18,
				zIndex: -2,
				draggable: true,
			},
			{
				model,
				shapeMap,
				diffData,
				diffState,
			},
		);

		otherShapes['train-shape'] = this.upsertShape(
			'text',
			'train-shape',
			{
				text: unicodeFormatter(cfg.train, 'train', {
					row: config.outShape.row,
					supress: config.outShape.supressOutput,
					count: config.outShape.supressCount
				}),
				fontFamily: 'Computer Modern',
				fill: config.content.fill,
				textAlign: 'left',
				textBaseline: 'top',
				fontSize: 18,
				zIndex: -1,
				draggable: true,
			},
			{
				model,
				shapeMap,
				diffData,
				diffState,
			}
		);

		otherShapes['inner-keyshape'] = this.upsertShape(
			'rect',
			'inner-keyshape',
			{
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

		const trainBBox = otherShapes['train-shape'].getBBox();

		const width = Math.max(trainBBox.width, config.outShape.defaultWidth);
		const height = Math.max(trainBBox.height, config.outShape.defaultHeight);

		keyShape.attr({
			width: 	width + config.outShape.padding*2,
			height: height + config.outShape.padding*2,
		});

		otherShapes['inner-keyshape'].attr({
			x: x + config.outShape.padding / 2,
			y: y + config.outShape.padding / 2,
			width: width + config.outShape.padding,
			height: height + config.outShape.padding,
		});

		otherShapes['train-shape'].attr({
			x: x + (width-trainBBox.width)/2 + config.outShape.padding,
			y: y + (height-trainBBox.height)/2 + config.outShape.padding,
		});
		
        return otherShapes;
	}

	/**
	 * Draw the node in simple mode -> only shows the variable values
	 * @param {*} model 
	 * @param {*} shapeMap 
	 * @param {*} diffData 
	 * @param {*} diffState 
	 * @returns 
	 */
	drawModeSimple(model, shapeMap, diffData, diffState) {
		const { keyShape } = shapeMap;
		const { id, data: cfg } = model;

		const keyShapeBBox = keyShape.getLocalBounds();
        const   x = -keyShapeBBox.halfExtents[0],
            	y = -keyShapeBBox.halfExtents[1];

		const otherShapes = {};

		otherShapes['label-shape'] = this.upsertShape(
			'text',
			'label-shape',
			{
				x:x-config.label.offset,
				y:y-config.label.offset,
				text: unicodeFormatter(cfg.label, 'label'),
				fontFamily: 'Computer Modern',
				fill: config.content.fill,
				textAlign: 'left',
          		textBaseline: 'top',
				fontSize: 18,
				zIndex: -2,
				draggable: true,
			},
			{
				model,
				shapeMap,
				diffData,
				diffState,
			},
		);
		
		otherShapes['train-shape'] = this.upsertShape(
			'text',
			'train-shape',
			{
				text: unicodeFormatter(cfg.train, 'train', {
					row: config.outShape.row,
					supress: config.outShape.supressOutput,
					count: config.outShape.supressCount
				}),
				fontFamily: 'Computer Modern',
				fill: config.content.fill,
				textAlign: 'left',
				textBaseline: 'top',
				fontSize: 18,
				zIndex: -1,
				draggable: true,
			},
			{
				model,
				shapeMap,
				diffData,
				diffState,
			}
		);

		otherShapes['inner-keyshape'] = this.upsertShape(
			'rect',
			'inner-keyshape',
			{
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

		const trainBBox = otherShapes['train-shape'].getBBox();

		const width = Math.max(trainBBox.width, config.outShape.defaultWidth);
		const height = Math.max(trainBBox.height, config.outShape.defaultHeight);

		keyShape.attr({
			width: 	width + config.outShape.padding*2,
			height: height + config.outShape.padding*2,
		});

		otherShapes['inner-keyshape'].attr({
			x: x + config.outShape.padding / 2,
			y: y + config.outShape.padding / 2,
			width: width + config.outShape.padding,
			height: height + config.outShape.padding,
		});

		otherShapes['train-shape'].attr({
			x: x + (width-trainBBox.width)/2 + config.outShape.padding,
			y: y + (height-trainBBox.height)/2 + config.outShape.padding,
		});

		return otherShapes;
	}

	/**
	 * draw the node in image mode -> renders node details as images
	 * @param {*} model 
	 * @param {*} shapeMap 
	 * @param {*} diffData 
	 * @param {*} diffState 
	 * @returns 
	 */
	drawModeImages(model, shapeMap, diffData, diffState) {
        const { id, data: cfg } = model;
		const { keyShape } = shapeMap;
		
        const keyShapeBBox = keyShape.getLocalBounds();
        const   x = -keyShapeBBox.halfExtents[0],
            	y = -keyShapeBBox.halfExtents[1];

        const otherShapes = {};

		const [ imgLbl, widthLbl, heightLbl ] = MathToImg(cfg.label, config.content.fill);

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
				draggable: true,
			},
			{
				model,
				shapeMap,
				diffData,
				diffState,
			},
		);

		const latexTrain = texFormatter(
			cfg.train,
			'train',
			{
				row: config.outShape.row,
				supress: config.outShape.supressOutput,
				count: config.outShape.supressCount
			}
		);

		const [ imgTrn, widthTrn, heightTrn ] = MathToImg(latexTrain, config.content.fill);

		const width = Math.max(widthTrn, config.outShape.defaultWidth);
		const height = Math.max(heightTrn, config.outShape.defaultHeight);

		keyShape.attr({
			width: 	width + config.outShape.padding*2,
			height: height + config.outShape.padding*2,
		});
		
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
}

/**
 * Custom node for input neurons
 * @class InputNeuron
 * @extends Extensions.RectNode
 * @constructor
 * @param {object} model - The model for the node.
 * @param {object} shapeMap - The shape map for the node.
 * @param {object} diffData - The diff data for the node.
 * @param {object} diffState - The diff state for the node.
 * @returns {object} - The custom node object.
 */
class InputNeuron extends Extensions.RectNode {
	drawOtherShapes(model, shapeMap, diffData, diffState) {
		config = get(nodeOptions);
		if(config.draw.mode === 'text')
			return this.drawModeText(model, shapeMap, diffData, diffState);
		if(config.draw.mode === 'simple')
			return this.drawModeSimple(model, shapeMap, diffData, diffState);
		if(config.draw.mode === 'image')
			return this.drawModeImages(model, shapeMap, diffData, diffState);
    }

	afterDraw(model, shapeMap, diffData, diffState) {
		const { keyShape, haloShape } = shapeMap;
		
		if(haloShape) {
			haloShape.attr({
				width: keyShape.attr('width'),
				height: keyShape.attr('height'),
			});
		}
	}

	/**
	 * draw the node in text mode -> renders node details as unicode mathemtical expressions
	 * @param {*} model 
	 * @param {*} shapeMap 
	 * @param {*} diffData 
	 * @param {*} diffState 
	 * @returns 
	 */
	drawModeText(model, shapeMap, diffData, diffState) {
        const { data: cfg } = model;
		const { keyShape } = shapeMap;
		
        const keyShapeBBox = keyShape.getLocalBounds();
        const   x = -keyShapeBBox.halfExtents[0],
            	y = -keyShapeBBox.halfExtents[1];

        const otherShapes = {};

		otherShapes['label-shape'] = this.upsertShape(
			'text',
			'label-shape',
			{
				x:x-config.label.offset,
				y:y-config.label.offset,
				text: unicodeFormatter(cfg.label, 'label'),
				fontFamily: 'Computer Modern',
				fill: config.content.fill,
				textAlign: 'left',
          		textBaseline: 'top',
				fontSize: 18,
				zIndex: -2,
				draggable: true,
			},
			{
				model,
				shapeMap,
				diffData,
				diffState,
			},
		);

		otherShapes['train-shape'] = this.upsertShape(
			'text',
			'train-shape',
			{
				text: unicodeFormatter(cfg.train, 'train', {
					row: config.inShape.row,
					supress: config.inShape.supressInput,
					count: config.inShape.supressCount,
					reverse: true,
				}),
				fontFamily: 'Computer Modern',
				fill: config.content.fill,
				textAlign: 'left',
				textBaseline: 'top',
				fontSize: 18,
				zIndex: -1,
				draggable: true,
			},
			{
				model,
				shapeMap,
				diffData,
				diffState,
			}
		);

		const trainBBox = otherShapes['train-shape'].getBBox();

		const width = Math.max(trainBBox.width, config.inShape.defaultWidth);
		const height = Math.max(trainBBox.height, config.inShape.defaultHeight);

		keyShape.attr({
			width: 	width + config.inShape.padding*2,
			height: height + config.inShape.padding*2,
		});

		otherShapes['train-shape'].attr({
			x: x + (width-trainBBox.width)/2 + config.inShape.padding,
			y: y + (height-trainBBox.height)/2 + config.inShape.padding,
		});

		otherShapes['input-shape'] = this.upsertShape(
			'polygon',
			'input-shape',
			{
				x: x,
				y: y,
				points: [
					[x - 2, y + (height + config.inShape.padding*2) / 2],
					[x - 15, y + (height + config.inShape.padding*2) / 2 + 12],
					[x - 15, y + (height + config.inShape.padding*2) / 2 - 12],
				],
				fill: config.inShape.stroke,
				stroke: config.inShape.stroke,
				r: 10,
				zIndex: -2,
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

	/**
	 * Draw the node in simple mode -> only shows the variable values
	 * @param {*} model 
	 * @param {*} shapeMap 
	 * @param {*} diffData 
	 * @param {*} diffState 
	 * @returns 
	 */
	drawModeSimple(model, shapeMap, diffData, diffState) {
		const { keyShape } = shapeMap;
		const { id, data: cfg } = model;

		const keyShapeBBox = keyShape.getLocalBounds();
        const   x = -keyShapeBBox.halfExtents[0],
            	y = -keyShapeBBox.halfExtents[1];

		const otherShapes = {};

		otherShapes['label-shape'] = this.upsertShape(
			'text',
			'label-shape',
			{
				x:x-config.label.offset,
				y:y-config.label.offset,
				text: unicodeFormatter(cfg.label, 'label'),
				fontFamily: 'Computer Modern',
				fill: config.content.fill,
				textAlign: 'left',
          		textBaseline: 'top',
				fontSize: 18,
				zIndex: -2,
				draggable: true,
			},
			{
				model,
				shapeMap,
				diffData,
				diffState,
			},
		);
		
		otherShapes['train-shape'] = this.upsertShape(
			'text',
			'train-shape',
			{
				text: unicodeFormatter(cfg.train, 'train', {
					row: config.inShape.row,
					supress: config.inShape.supressInput,
					count: config.inShape.supressCount,
					reverse: true,
				}),
				fontFamily: 'Computer Modern',
				fill: config.content.fill,
				textAlign: 'left',
				textBaseline: 'top',
				fontSize: 18,
				zIndex: -1,
				draggable: true,
			},
			{
				model,
				shapeMap,
				diffData,
				diffState,
			}
		);

		const trainBBox = otherShapes['train-shape'].getBBox();

		const width = Math.max(trainBBox.width, config.inShape.defaultWidth);
		const height = Math.max(trainBBox.height, config.inShape.defaultHeight);

		keyShape.attr({
			width: 	width + config.inShape.padding*2,
			height: height + config.inShape.padding*2,
		});

		otherShapes['train-shape'].attr({
			x: x + (width-trainBBox.width)/2 + config.inShape.padding,
			y: y + (height-trainBBox.height)/2 + config.inShape.padding,
		});

		otherShapes['input-shape'] = this.upsertShape(
			'polygon',
			'input-shape',
			{
				x: x,
				y: y,
				points: [
					[x - 2, y + (height + config.inShape.padding*2) / 2],
					[x - 15, y + (height + config.inShape.padding*2) / 2 + 12],
					[x - 15, y + (height + config.inShape.padding*2) / 2 - 12],
				],
				fill: config.inShape.stroke,
				stroke: config.inShape.stroke,
				r: 10,
				zIndex: -2,
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

	/**
	 * draw the node in image mode -> renders node details as images
	 * @param {*} model 
	 * @param {*} shapeMap 
	 * @param {*} diffData 
	 * @param {*} diffState 
	 * @returns 
	 */
	drawModeImages(model, shapeMap, diffData, diffState) {
        const { id, data: cfg } = model;
		const { keyShape } = shapeMap;
		
        const keyShapeBBox = keyShape.getLocalBounds();
        const   x = -keyShapeBBox.halfExtents[0],
            	y = -keyShapeBBox.halfExtents[1];

        const otherShapes = {};

		const [ imgLbl, widthLbl, heightLbl ] = MathToImg(cfg.label, config.content.fill);

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
				draggable: true,
			},
			{
				model,
				shapeMap,
				diffData,
				diffState,
			},
		);

		const latexTrain = texFormatter(
			cfg.train,
			'train',
			{
				row: config.inShape.row,
				supress: config.inShape.supressInput,
				count: config.inShape.supressCount,
				reverse: true,
			}
		);

		const [ imgTrn, widthTrn, heightTrn ] = MathToImg(latexTrain, config.content.fill);

		const width = Math.max(widthTrn, config.inShape.defaultWidth);
		const height = Math.max(heightTrn, config.inShape.defaultHeight);

		keyShape.attr({
			width: 	width + config.inShape.padding*2,
			height: height + config.inShape.padding*2,
		});

		otherShapes['train-shape'] = this.upsertShape(
			'image',
			'train-shape',
			{
				x:x+(width-widthTrn)/2 + config.inShape.padding,
				y:y+(height-heightTrn)/2 + config.inShape.padding,
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

		otherShapes['input-shape'] = this.upsertShape(
			'polygon',
			'input-shape',
			{
				x: x,
				y: y,
				points: [
					[x - 2, y + (height + config.inShape.padding*2) / 2],
					[x - 15, y + (height + config.inShape.padding*2) / 2 + 12],
					[x - 15, y + (height + config.inShape.padding*2) / 2 - 12],
				],
				fill: config.inShape.stroke,
				stroke: config.inShape.stroke,
				r: 10,
				zIndex: -2,
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
}

export { RegularNeuron, OutputNeuron, InputNeuron };