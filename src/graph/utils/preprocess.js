import { texFormatter } from "./format";
import { nodeOptions } from "../../stores/settings";
import { addImage } from "../../stores/data";
import { MathToImg } from "../../utils/math";
import { get } from "svelte/store";

export function preprocessNode(node, simulating = false) {
	const { id, data } = node;
	const config = get(nodeOptions);
	const img = {};

	img.label = MathToImg(node.data.label);
		
	if(data.type === 'out') {
		data.size = [config.outShape.defaultWidth, config.outShape.defaultHeight];

		const latexTrain = texFormatter(
			data.train,
			'train',
			{
				row: config.outShape.row,
				supress: config.outShape.supressOutput,
				count: config.outShape.supressCount
			}
		);

		img.train = MathToImg(latexTrain);

		data.size = [
			img.train[1] < config.outShape.defaultWidth ?
				config.outShape.defaultWidth: img.train[1],
			img.train[2] < config.outShape.defaultHeight ?
				config.outShape.defaultHeight: img.train[2],
		];
	}

	if(data.type === 'reg') {
		const latexVar = texFormatter(data.var_, 'var');
		const latexPrf = texFormatter(data.prf, 'prf');

		img.var = MathToImg(latexVar);
		img.prf = MathToImg(latexPrf);

		data.size = [
			Math.max(img.prf[1], img.var[1]),
			img.prf[2] + img.var[2] + config.content.divider,
		];
	}
	
	addImage(id, img);
}

export const preprocessNodes = (content) => {
	content.nodes.forEach(node => {
		return preprocessNode(node);
	});
	
	return content;
}