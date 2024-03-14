import { texFormat } from '../../stores/settings.js';
import { chunkArray } from './chunk.js';

export const texFormatter = (content, type) => {
    const specs = texFormat;
    const {
        rowMax:rm,
        prfMax:pm,
        singleFormatVar,
        rowFormatVar,
        singleFormatPrf,
        rowFormatPrf,
        alignmentWrapper
    } = specs;
    const max =   type === 'var' ? rm 
                : type === 'prf' ? pm : null;
                
    const arr = content.map(([name, ...content],i) => {
            return [name,content];
    });
    
    const latexSingle = arr.map((v, i) => {
        return    type === 'var' ? singleFormatVar(v[0], v[1])
                : type === 'prf' ? singleFormatPrf(v[0], v[1])
                : null;
    });
    
    const latexRow = chunkArray(latexSingle, max);

    const latex = latexRow.map((v, i) => {
        return    type === 'var' ? rowFormatVar(v)
                : type === 'prf' ? rowFormatPrf(v)
                : null;
    }).join(`\\\\`);
    
    return alignmentWrapper(latex);
}

export const trainFormatter = (content, row, supress=null, count=null) => {
	let accumulator = '';
	let compressed = content;
	row = row < 1 ? 5 : row;

	if (supress) {
        compressed = content.slice(-count);
    }
		
	compressed.forEach((t, i) => {
		accumulator += `${t}`;
        if((i+1) % row) accumulator += `,`;
		if (!((i+1) % row)) accumulator += `\\\\`;
	});
	
	return texFormat.gatherWrapper(accumulator);
}