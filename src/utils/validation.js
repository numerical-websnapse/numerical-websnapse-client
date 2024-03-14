/* NAME FORMAT
    - Base_Subscript
    - Base_(Subscript1,Subscript2,...)

    - Base starts with a letter
    - Base and Subscript can be wrapped in {} or \text{} or \mathbf{}
    - Subscript can be a list of subscripts separated by commas
    - Multiple subscripts must be wrapped in ()
    - If a subscript has multiple characters, it must be wrapped in {}
*/

const validName = (() => {
    const alpha = '[a-zA-Z]';
    const characters = '[a-zA-Z0-9]';

    const innerSubscript = `${characters}+`;
    const multipleInnerSubscript = `${characters}+(,${characters}+)+`;
    const innerSubscriptWrapper = `(${innerSubscript}|\\(${innerSubscript}\\)|\\(${multipleInnerSubscript}\\)){1}`;
    const subscripts = `(_(${characters}|\{${innerSubscriptWrapper}\}|\\\\text\{${innerSubscriptWrapper}\}|\\\\mathbf\{${innerSubscriptWrapper}\}){1})?`;

    const innerBase = `(${characters}+)`;
    const innerBaseWrapper = `(\\(${innerBase}\\)|${alpha}${innerBase}?){1}`;
    const base = `(${innerBaseWrapper}|\{${innerBaseWrapper}\}|\\\\text\{${innerBaseWrapper}\}|\\\\mathbf\{${innerBaseWrapper}\}){1}`;

    const regex = `^${base}${subscripts}$`;
    return new RegExp(regex);
})();

// const validName = /^([a-zA-Z0-9(),]+|\{[a-zA-Z0-9(),]+\}|\\text\{[a-zA-Z0-9(),]+\}|\\mathbf\{[a-zA-Z0-9(),]+\}){1}(_[a-zA-Z0-9(),]+|_\{[a-zA-Z0-9(),]+\}|_\\text\{[a-zA-Z0-9(),]+\}|_\\mathbf\{[a-zA-Z0-9(),]+\})?$/;
const validValue = /^(-?\d+||-?\d+\.\d+||-?\d+\/\d+)$/;

export const nodeLabelValidation = (label) => {
    if (label === '') { return 'Node must have a label'; }
}

export const nodeTypeValidation = (ntype) => {
    if (ntype === '') { return 'Node must have a type'; }
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

export const nodeValidation = (node) => {
    let errors = [];
    const { data } = node;

    
    nodeLabelValidation(data.label) && errors.push(nodeLabelValidation(data.label));
    nodeTypeValidation(data.ntype) && errors.push(nodeTypeValidation(data.ntype));
    
    if (data.ntype === 'reg') {
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

    // check if each nodes contains the required fields (id, data->(data.label, data.ntype, data.var_, data.prf, data.x, data.y))
    const requiredFields = ['id', 'data'];
    const dataFields = ['label', 'ntype', 'var_', 'prf', 'x', 'y'];

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