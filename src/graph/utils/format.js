import { unicodeFormat } from './unicode';
import { texFormat } from './latex';
import { chunkArray } from './chunk';

export const texFormatter = (content, type, details=null) => {
    const specs = texFormat;
    const {
        rowMax:rm,
        prfMax:pm,
        singleFormatVar,
        rowFormatVar,
        singleFormatPrf,
        rowFormatPrf,
        trainFormat,
        alignmentWrapper
    } = specs;
    const max =   type === 'var' ? rm 
                : type === 'prf' ? pm : null;

    if (type === 'train') {
        return trainFormat(content, details);
    }
                
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

export const unicodeFormatter = (content, type, details = null) => {
    const {
        rowMax:rm,
        prfMax:pm,
        singleFormatVar,
        rowFormatVar,
        singleFormatPrf,
        rowFormatPrf,
        nameFormat,
        trainFormat
    } = unicodeFormat;

    if (type === 'train') {
        return trainFormat(content, details);
    }

    if (type === 'label') {
        return nameFormat(content);
    }

    const max =   type === 'var' ? rm 
                : type === 'prf' ? pm
                : null;

    const arr = content.map(([name, ...values], i) => {
        return [name, values];
    });

    const unicodeSingle = arr.map((v, i) => {
        return    type === 'var' ? singleFormatVar(v[0], v[1])
                : type === 'prf' ? singleFormatPrf(v[0], v[1])
                : null;
    });

    const unicodeRow = chunkArray(unicodeSingle, max);

    const unicode = unicodeRow.map((v, i) => {
        return    type === 'var' ? rowFormatVar(v)
                : type === 'prf' ? rowFormatPrf(v)
                : null;
    }).join(`\n`);

    return unicode;
}