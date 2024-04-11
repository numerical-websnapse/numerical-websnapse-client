import { preprocessNode } from '../utils/preprocess';
import { neuronTemplate } from '../../stores/graph';
import { minimap } from '../plugins/minimap';
import { getGraph, setGraphLocalData } from '../../stores/graph';

export function addNode(content = null, graph = null) {
    let node = neuronTemplate();
    
    if (content !== null) {
        const type = content.data.type;
        const var_ = content.data.var_;
        const prf = content.data.prf;
        const train = content.data.train;

        node = {
            ...node,
            data: {
                ...content.data,
                var_: type === "reg" ? var_ : [],
                prf: type === "reg" ? prf : [],
                train: type === "in" ? train : [],
            },
        };
    }
    
    preprocessNode(node);
    graph = graph || getGraph();
    graph.addData('node', node);
    setGraphLocalData();
    return node.id;
}

export function updateNode(id, content, graph = null, simulating = false) {
    graph = graph || getGraph();
    const node = graph.getNodeData(id);

    const type = content.data.type;
    const var_ = content.data.var_;
    const prf = content.data.prf;
    const train = content.data.train;
    
    const updatedNode = {
        ...node,
        data: {
            ...content.data,
            var_: type === "reg" ? var_ : [],
            prf: type === "reg" ? prf : [],
            train: type === "out" || type === "in" ? train : [],
        },
    };

    graph.updateData('node', updatedNode);
    if (!simulating) setGraphLocalData();
}

export function removeNode(id, graph = null) {
    graph = graph || getGraph();
    graph.removeData('node', id);
    graph.updatePlugin(minimap(
        graph.getAllEdgesData().length
    ));
    setGraphLocalData();
}