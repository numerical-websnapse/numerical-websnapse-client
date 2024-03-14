const MathJax = window.MathJax;

const MathToImg = (text) => {
	const [em, ex] = [10, 5];
	let mathjaxWrapper = MathJax.tex2svg(`${text}`, {
		em, ex, display: true,
	});

	let mathjaxSvg = mathjaxWrapper.getElementsByTagName('svg')[0];
	const svg = mathjaxSvg.outerHTML;
	const width = mathjaxSvg.getAttribute('width');
	const height = mathjaxSvg.getAttribute('height');
	const px_width = parseInt(width.slice(0, -2) * 0.5 * 16);
	const px_height = parseInt(height.slice(0, -2) * 0.5 * 16);

	const img = `data:image/svg+xml;utf-8,${encodeURIComponent(svg)}`;

	return [ img, px_width, px_height ];
};


const MathToSvgElement = (math, attributes={}) => {
	const parser = new DOMParser();
	const svgDocument = parser.parseFromString(
		MathJax.tex2svg(math).innerHTML,
		"text/html"
	);

	const svg = svgDocument.body.firstChild;
	Object.entries(attributes).forEach(([key, value]) => {
		svg.setAttribute(key, value);
	});

	return svg.outerHTML;
};

const matrixFormatter = (matrixArray) => {
    let matrix = '\\begin{bmatrix}\n';
    for (let i = 0; i < matrixArray.length; i++) {
        for (let j = 0; j < matrixArray[i].length; j++) {
            matrix += matrixArray[i][j];
            if (j !== matrixArray[i].length - 1) {
                matrix += ' & ';
            }
        }
        matrix += ' \\\\\n'; // New row
    }
    matrix += '\\end{bmatrix}';
    return matrix;
}

export { MathToImg, MathToSvgElement, matrixFormatter };