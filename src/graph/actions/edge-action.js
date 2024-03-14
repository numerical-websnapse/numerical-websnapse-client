import { edgeTemplate } from '../../stores/graph';
import { minimap } from '../plugins/minimap';
import { getGraph, setGraphLocalData } from '../../stores/graph';

/// Not used
export function addEdge(content = null, graph = null) {
    let edge = edgeTemplate();
    if (content !== null) {
        edge = {
            ...edge,
            source: content.label || edge.label,
            target: content.ntype || edge.ntype,
            data: content.data || edge.data,
        };
    }

    graph = graph || getGraph();
    graph.addData('edge', edge);
    setGraphLocalData();
}

export function removeEdge(id, graph = null) {
    graph = graph || getGraph();
    graph.removeData('edge', id);
    graph.updatePlugin(minimap());
    setGraphLocalData();
}