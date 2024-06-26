import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';
import { get } from 'svelte/store';
import { system } from './system';
import { deepCopy } from '../utils/copy';

const DUMMY_NODE_ID = 'g6-create-edge-dummy-node';
const VIRTUAL_EDGE_ID = 'g6-create-edge-virtual-edge';

// TEMPLATES
export const edgeTemplate = (source = null, target = null) => {
    return {
        id: `${uuidv4().slice(0, 12)}`,
        source: source || "n_1",
        target: target || "n_out",
        data: {}
    }
}

export const neuronTemplate = (x = 0, y = 0) => {
    return {
        id: `${uuidv4().slice(0, 8)}`,
        data: {
            var_: [[ 'x_1', '0' ]],
            prf: [[ 'f_1', null, [['x_1','1']] ]],
            train: [],
            label: 'n1',
            type: 'reg',
            x,
            y,
        }
    };
}

// Stores
export const graph = writable(0);
export const neuron = writable(neuronTemplate());

// Methods
export const getGraph = () => {
    return get(graph);
}

export const changeMode = (mode) => {
    getGraph().setMode(mode);
    system.update(system => {
        system.mode = mode;
        return system;
    });
}

const cleanNodes = (nodes) => {
    return nodes.filter(function (node) { 
        return node.id != DUMMY_NODE_ID;
    }).map((node) => {
        return {
            id: node.id,
            data: {
                var_: node.data.var_,
                prf: node.data.prf,
                train: node.data.train,
                label: node.data.label,
                type: node.data.type,
                x: node.data.x,
                y: node.data.y,
            }
        }
    });
}

const cleanEdges = (edges) => {
    return edges.filter(function (edge) { 
        return edge.id != VIRTUAL_EDGE_ID;
    }).map((edge) => {
        return {
            id: edge.id,
            source: edge.source,
            target: edge.target,
        }
    });
}

export const setGraphLocalData = () => {
    const nodes = cleanNodes(getGraph().getAllNodesData());
    const edges = cleanEdges(getGraph().getAllEdgesData());
    const data = { nodes, edges };
    console.log('setGraphLocalData:', data);
    localStorage.setItem('data', JSON.stringify(data));
}

export const setPositionLocalData = () => {
    const data = JSON.parse(localStorage.getItem('data'));
    getGraph().getAllNodesData().forEach((node) => {
        const index = data.nodes.findIndex((n) => n.id === node.id);
        data.nodes[index].data.x = node.data.x;
        data.nodes[index].data.y = node.data.y;
    });
    localStorage.setItem('data', JSON.stringify(data));
}

export const resetNeuron = (x = 0, y = 0) => {
    neuron.set(neuronTemplate(x, y))
}

export const setNeuron = (id) => {
    const node = deepCopy(getGraph().getNodeData(id));
    neuron.set({
        id: node.id,
        data: {
            var_: node.data.var_,
            prf: node.data.prf,
            train: node.data.train,
            label: node.data.label,
            type: node.data.type,
            x: node.data.x,
            y: node.data.y,
        }
    })
}