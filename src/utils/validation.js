const symbols = {
    "\\alpha": "\u{1D6FC}",
    "\\beta": "\u{1D6FD}",
    "\\gamma": "\u{1D6FE}",
    "\\delta": "\u{1D6FF}",
    "\\epsilon": "\u{1D700}",
    "\\zeta": "\u{1D701}",
    "\\eta": "\u{1D702}",
    "\\theta": "\u{1D703}",
    "\\iota": "\u{1D704}",
    "\\kappa": "\u{1D705}",
    "\\lambda": "\u{1D706}",
    "\\mu": "\u{1D707}",
    "\\nu": "\u{1D708}",
    "\\xi": "\u{1D709}",
    "\\pi": "\u{1D70B}",
    "\\rho": "\u{1D70C}",
    "\\sigma": "\u{1D70E}",
    "\\tau": "\u{1D70F}",
    "\\upsilon": "\u{1D710}",
    "\\phi": "\u{1D711}",
    "\\chi": "\u{1D712}",
    "\\psi": "\u{1D713}",
    "\\omega": "\u{1D714}",
    "\\Alpha": "\u{1D6E2}",
    "\\Beta": "\u{1D6E3}",
    "\\Gamma": "\u{0393}",
    "\\Delta": "\u{0394}",
    "\\Epsilon": "\u{1D716}",
    "\\Zeta": "\u{1D717}",
    "\\Eta": "\u{1D718}",
    "\\Theta": "\u{0398}",
    "\\Iota": "\u{1D71A}",
    "\\Kappa": "\u{1D71B}",
    "\\Lambda": "\u{039B}",
    "\\Mu": "\u{1D71D}",
    "\\Nu": "\u{1D71E}",
    "\\Xi": "\u{039E}",
    "\\Pi": "\u{03A0}",
    "\\Rho": "\u{1D71F}",
    "\\Sigma": "\u{03A3}",
    "\\Tau": "\u{1D720}",
    "\\Upsilon": "\u{03A5}",
    "\\Phi": "\u{03A6}",
    "\\Chi": "\u{1D722}",
    "\\Psi": "\u{03A8}",
    "\\Omega": "\u{03A9}",
    "\\infty": "\u{221E}",
    "\\rightarrow": "\u{2192}",
    "\\leftarrow": "\u{2190}",
    "\\leftrightarrow": "\u{2194}",
    "\\Rightarrow": "\u{21D2}",
    "\\Leftarrow": "\u{21D0}",
    "\\Leftrightarrow": "\u{21D4}",
    "\\sum": "\u{2211}",
    "\\prod": "\u{220F}",
    "\\int": "\u{222B}",
    "\\sqrt": "\u{221A}",
    "\\times": "\u{00D7}",
    "\\div": "\u{00F7}",
    "\\leq": "\u{2264}",
    "\\geq": "\u{2265}",
    "\\neq": "\u{2260}",
    "\\approx": "\u{2248}",
    "\\propto": "\u{221D}",
    "\\subseteq": "\u{2286}",
    "\\supseteq": "\u{2287}",
    "\\subset": "\u{2282}",
    "\\supset": "\u{2283}",
    "\\cup": "\u{222A}",
    "\\cap": "\u{2229}",
    "\\emptyset": "\u{2205}",
    "\\forall": "\u{2200}",
    "\\exists": "\u{2203}",
    "\\nabla": "\u{2207}",
    "\\pm": "\u{00B1}",
    "\\mp": "\u{2213}",
    "\\cdot": "\u{22C5}",
    "\\ldots": "\u{2026}",
    "\\cdots": "\u{22EF}",
    "\\vdots": "\u{22EE}",
    "\\ddots": "\u{22F1}",
};

const validName = (() => {
    const alpha = '[a-zA-Z]';
    const characters = '[a-zA-Z0-9]';
    const numbers = '[0-9]';
    const regexSymbols = Object.keys(symbols).map((symbol) => `\\${symbol}`).join('|');
    const charactersAndSymbols = `${characters}|${regexSymbols}`

    const innerSubscript = `${numbers}+`;
    const multipleInnerSubscript = `${numbers}+(,${numbers}+)+`;
    const innerSubscriptWrapper = `(${innerSubscript}|\\(${innerSubscript}\\)|\\(${multipleInnerSubscript}\\)){1}`;
    const subscripts = `(_(${numbers}|\{${innerSubscriptWrapper}\}|\\\\text\{${innerSubscriptWrapper}\}|\\\\mathbf\{${innerSubscriptWrapper}\}){1})?`;

    const innerBase = `(${characters}+)`;
    const innerBaseWrapper = `(\\(${innerBase}\\)|${alpha}${innerBase}?){1}`;
    const base = `(${innerBaseWrapper}|\{${innerBaseWrapper}\}|\\\\text\{${innerBaseWrapper}\}|\\\\mathbf\{${innerBaseWrapper}\}|(${charactersAndSymbols})+){1}`;

    const regex = `^${base}${subscripts}$`;
    return new RegExp(regex);
})();

const validValue = /^(-?\d+||-?\d+\.\d+||-?\d+\/\d+)$/;
const trainValue = /^((-?\d+||-?\d+\.\d+||-?\d+\/\d+)(,-?\d+||,-?\d+\.\d+||,-?\d+\/\d+)*)$/;

export const nodeLabelValidation = (label) => {
    if (label === '') { return 'Node must have a label'; }
    if (!validName.test(label)) { return 'Node has an invalid label'; }
}

export const nodeTypeValidation = (type) => {
    if (type === '') { return 'Node must have a type'; }
}

export const nameValidation = (name, type, index=null) => {
    if (name === '') {
        return `${type}${index + 1 ? ' ' + (index + 1) : ''} must have a name`;
    }

    if (!validName.test(name)) {
        return `${type}${index + 1 ? ' ' + (index + 1) : ''} has an invalid name`;
    }
}

export const valueValidation = (value, type, index=null) => {
    if (type === 'Threshold' && !value) return;
    if (value === '') {
        return `${type}${index + 1 ? ' ' + (index + 1) : ''} must have a value`;
    }

    if (!validValue.test(value)) {
        return `${type}${index + 1 ? ' ' + (index + 1) : ''} has an invalid value`;
    }
}

export const trainValidation = (train) => {
    if(typeof train === 'string') {
        if (train === '') {
            return 'Input neuron must have a spike train';
        }
    
        if (!trainValue.test(train)) {
            return 'Input neuron has an invalid spike train';
        }
    }

    if(Array.isArray(train)) {
        if (!train.length) {
            return 'Input neuron must have a spike train';
        }

        let error = undefined;
        train.forEach((value, index) => {
            if (!value) {
                error = `Train ${index + 1} must have a value`;
            }
        
            if (!validValue.test(value)) {
                error = `Train ${index + 1} has an invalid value`;
            }
        });

        return error;
    }
}

export const nodeValidation = (node) => {
    let errors = [];
    const { data } = node;

    nodeLabelValidation(data.label) && errors.push(nodeLabelValidation(data.label));
    nodeTypeValidation(data.type) && errors.push(nodeTypeValidation(data.type));
    
    if (data.type === 'reg') {
        const varNames = data.var_.map(([name, value]) => name);
        if (new Set(varNames).size !== varNames.length) {
            errors.push('Node has duplicate variable names');
        }

        data.var_.forEach(([name, value], index) => {
            nameValidation(name, 'Variable', index) && errors.push(nameValidation(name, 'Variable', index));
            valueValidation(value, 'Variable', index) && errors.push(valueValidation(value, 'Variable', index));
        });

        const prfNames = data.prf.map(([name, thld, vars]) => name);
        if (new Set(prfNames).size !== prfNames.length) {
            errors.push('Node has duplicate function names');
        }

        data.prf.forEach(([name, thld, vars], index) => {
            nameValidation(name, 'Function', index) && errors.push(nameValidation(name, 'Function', index));
            valueValidation(thld, 'Threshold', index) && errors.push(valueValidation(thld, 'Threshold', index));
            vars.forEach(([name, value], j) => {
                valueValidation(value, 'Coefficient', j) && errors.push(valueValidation(value, 'Coefficient', j));
            });
        });
    }

    if (data.type === 'in') {
        trainValidation(data.train) && errors.push(trainValidation(data.train));
    }
    
    return errors;
}

export const dataValidation = (data) => {
    let errors = [];

    if (!data.nodes) {
        errors.push('Graph must have nodes');
        return errors;
    }

    if (!data.edges) {
        errors.push('Graph must have edges');
        return errors;
    }

    // check object structure of nodes and edges
    if (!Array.isArray(data.nodes)) {
        errors.push('Nodes must be an array');
        return errors;
    }

    if (!Array.isArray(data.edges)) {
        errors.push('Edges must be an array');
        return errors;
    }

    // check if each nodes contains the required fields (id, data->(data.label, data.type, data.var_, data.prf, data.x, data.y))
    const requiredFields = ['id', 'data'];
    const dataFields = ['label', 'type', 'var_', 'prf', 'x', 'y'];

    data.nodes.forEach((node) => {
        requiredFields.forEach((field) => {
            if (!node[field]) {
                errors.push(`Node ${node.id} must have a ${field}`);
            }
        });

        if (node.data && typeof node.data === 'object') {
            dataFields.forEach((field) => {
                if (!node.data[field] === undefined) {
                    errors.push(`Node ${node.id} must have a data.${field}`);
                }
            });
        }
    });

    // check if each edges contains the required fields (source, target)
    const edgeFields = ['id', 'source', 'target'];
    data.edges.forEach((edge) => {
        edgeFields.forEach((field) => {
            if (!edge[field]) {
                errors.push(`Edge must have the field '${field}'`);
            }
        });
    });

    if (errors.length) return errors;

    // check if each node has valid data
    data.nodes.forEach((node) => {
        nodeValidation(node).forEach((error) => {
            errors.push(error);
        });
    });

    if (errors.length) return errors;

    const nodes = data.nodes.map((node) => node.id);
    const edges = [];

    data.edges.forEach((edge) => {
        if (!nodes.includes(edge.source)) {
            errors.push(`Edge source: ${edge.source} does not exist`);
        }
        else if (!nodes.includes(edge.target)) {
            errors.push(`Edge target: ${edge.target} does not exist`);
        }
        else {
            if (edges.includes(edge.source + edge.target)) {
                errors.push(`Edge from ${edge.source} to ${edge.target} already exists`);
            }
            else {
                edges.push(edge.source + edge.target);
            }
        }
    });

    return errors;
}