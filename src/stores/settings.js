import { writable } from 'svelte/store';

export const nodeOptions = writable({
    label: {
        offset: 23,
        margin: 6,
    },
    content: {
        padding: 20,
        divider: 15,
    },
    keyShape: {
        lineWidth: 1,
        defaultWidth: 50,
        defaultHeight: 50,
        radius: 15,
        fill: '#FFFFFF', //'transport',
        stroke: '#000000',
    },
    haloShape: {
        stroke: '#2E2EFF',
    },
    outShape: {
        padding: 10,
        lineWidth: 1,
        defaultWidth: 50,
        defaultHeight: 50,
        radius: 15,
        row: 5,
        supressOutput: true,
        supressCount: 5,
        fill: '#FFFFFF',
        stroke: '#000000',
    }
})

export const edgeOptions = writable({
    keyShape: {
        stroke: '#000000',
        lineWidth: 1,
    },
    endArrow: {
        stroke: '#000000',
        fill: '#000000',
        path: 'M 0,0 L 12,6 L 9,0 L 12,-6 Z',
    },
    // growShape: {
    //     lineWidth: 3,
    //     lineDash: ["100%", 0],
    //     stroke: '#1e429f',
    //     direction: '',
    // },
    // colorShape: {
    //     stroke: '#a7e3fa',
    //     lineWidth: 2
    // },
})

export const texFormat = {
    rowMax: 3,
    prfMax: 1,
    singleFormatVar: (name, value) => {
        return `${name}[${value}]`;
    },
    rowFormatVar: (row) => {
        return row.join(`,\\hspace{5px}`);
    },
    singleFormatPrf: (name, value) => {
        const expression = value[1].reduce(function(p, d, i) {
            const val = d[1];

            // if value is 0, return empty string if first value, else return previous value
            if (val === '0') {
                if (i === 0) return '';
                return p;
            };
            
            // assume val is a string that can be formatted as int, float, or fraction  (from regex check)
            const isNegative = val[0] === '-';
            const coef = isNegative ? val.slice(1) : val;
            
            // wrap coefficient if its a fraction or decimal
            // if fraction, wrap in \frac{}{}, split by '/'
            // check if value is 1 or -1
            const isFraction = coef.includes('/');
            const isDecimal = coef.includes('.');
            const isOne = coef === '1';
            let coefWrap = isOne ? '' : coef;
            // if (isFraction) {
            //     const [num, den] = coef.split('/');
            //     coefChk = `\\left(\\frac{${num}}{${den}}\\right)`;   // wrap in \frac{}{}
            // }
            // if (isDecimal) {
            //     coefChk = `(${coefChk})`;                            // wrap in ()
            // }
            coefWrap = isFraction || isDecimal ? `(${coefWrap})` : coefWrap;
            const op = isNegative ? `-${coefWrap}` : ( !p ? `${coefWrap}` : `+${coefWrap}`);
            const var_ = op + d[0];
            
            if (i === 0) return '' + var_;
            return p + var_;
        }, 0);

        const threshold = value[0] ? `|_{${value[0]}}` : '';

        if (expression === '') return `${name} &= 0${threshold}`;
        return `${name} &= ${expression}${threshold}`;
    },
    rowFormatPrf: (row) => {
        return row.join(',\\hspace{5px}');
    },
    alignmentWrapper: (content) => {
        return `\\begin{align*}${content}\\end{align*}`;
    },
    gatherWrapper: (content) => {
        return `\\begin{gather*}${content}\\end{gather*}`;
    },
}