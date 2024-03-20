import { preprocessNode } from '../utils/preprocess';
import { neuronTemplate } from '../../stores/graph';
import { minimap } from '../plugins/minimap';
import { getGraph, setGraphLocalData } from '../../stores/graph';
import { deleteImage } from '../../stores/data';
import { objectsMatch } from '../../utils/match';
import { deepCopy } from '../../utils/copy';

export function addNode(content = null, graph = null) {
    let node = neuronTemplate();
    
    if (content !== null) {
        const ntype = content.data.ntype;
        const var_ = content.data.var_;
        const prf = content.data.prf;

        node = {
            ...node,
            data: {
                ...content.data,
                var_: ntype === "reg" ? var_ : [],
                prf: ntype === "reg" ? prf : [],
                train: [],
            },
        };

        if (ntype === "out") node.data.train = [];
    }
    
    preprocessNode(node);
    graph = graph || getGraph();
    graph.addData('node', node);
    setGraphLocalData();
}

export function updateNode(id, content, graph = null, simulating = false) {
    graph = graph || getGraph();
    const node = graph.getNodeData(id);

    const ntype = content.data.ntype;
    const var_ = content.data.var_;
    const prf = content.data.prf;
    const train = content.data.train;
    
    const updatedNode = {
        ...node,
        data: {
            ...content.data,
            var_: ntype === "reg" ? var_ : [],
            prf: ntype === "reg" ? prf : [],
            train: ntype === "out" ? train : [],
        },
    };

    graph.updateData('node', updatedNode);
    if (!simulating) setGraphLocalData();
}

export function removeNode(id, graph = null) {
    graph = graph || getGraph();
    graph.removeData('node', id);
    graph.updatePlugin(minimap());
    deleteImage(id);
    setGraphLocalData();
}

export function getCopyNode(id, graph = null) {
    graph = graph || getGraph();
    return deepCopy(graph.getNodeData(id));
}