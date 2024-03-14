import { minimap } from '../plugins/minimap';
import { getGraph, setGraphLocalData } from '../../stores/graph';

export function clearGraph(graph = null) {
    graph = graph || getGraph();
    graph.clear();
    graph.updatePlugin(minimap);
    setGraphLocalData();
}