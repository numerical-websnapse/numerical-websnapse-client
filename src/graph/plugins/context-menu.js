import { addNode, removeNode } from '../actions/node-action.js';
import { addEdge, removeEdge } from '../actions/edge-action.js';
import { neuronAction, getModal } from '../../stores/modals.js';
import { setNeuron, resetNeuron } from '../../stores/graph.js';
import { system } from '../../stores/system.js';
import { get } from 'svelte/store';

const contextMenuNode = {
    type: 'menu',
    key: 'node-context-menu',
    trigger: 'contextmenu',
    className: 'g6-component-contextmenu-custom',
    itemTypes: ['node'],
    getContent: (e) => {
        return `
        <ul class="g6-contextmenu-ul-custom">
            ${get(system).editing ? `
            <li>
                <button code="edit" class="g6-contextmenu-button-custom">
                    <svg 
                        code="edit"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path code="edit" d="M12 20h9"></path>
                        <path code="edit" d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                    <span code="edit">Edit node</span>
                </button>
            </li>
            ` : ''}
            <li>
                <button code="focus" class="g6-contextmenu-button-custom">
                    <svg
                        code="focus"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <circle code="focus" cx="11" cy="11" r="8"></circle>
                        <line code="focus" x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <span code="focus">Focus node</span>
                </button>
            </li>
            ${get(system).editing ? `
            <li>
                <button code="clone" class="g6-contextmenu-button-custom">
                    <svg
                        code="clone"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <rect code="clone" x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path code="clone" d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    <span code="clone">Copy node</span>
                </button>
            </li>
            <li>
                <button code="delete" class="g6-contextmenu-button-custom">
                    <svg
                        code="delete"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <rect code="delete" x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <line code="delete" x1="8" y1="12" x2="16" y2="12"></line>
                    </svg>
                    <span code="delete">Delete</span>
                </button>
            </li>
            ` : ''}
        </ul>
        `;
    },
    handleMenuClick: (target, itemId, graph) => {
        const code = Object.values(target.attributes)
                        .find((item) => item.name === 'code');
        
        if(!code) {
            console.log('Misclicked');
            return;
        }

        const { value } = code;

        switch(value) {
            case 'edit': {
                neuronAction('edit');
                setNeuron(itemId);
                getModal('nodeModal').show();
                break;
            }
            case 'delete': {
                removeNode(itemId, graph);
                break;
            }
            case 'focus': {
                graph.focusItem(itemId, {
                    easing: 'ease-in',
                    duration: 1000,
                });

                setTimeout(() => {graph.zoomTo(3, undefined, {
                    easing: 'ease-in',
                })}, 1000);
                break;
            }
            case 'clone': {
                const node = graph.getNodeData(itemId);
                node.data.x += 15;
                node.data.y += 15;
                addNode(node, graph);
                break;
            }
            default:
                break;
        }
    },
};

const contextMenuCanvas = {
    type: 'menu',
    key: 'canvas-context-menu',
    trigger: 'contextmenu',
    className: 'g6-component-contextmenu-custom',
    itemTypes: ['canvas'],
    getContent: (e) => {
        return `
        <ul class="g6-contextmenu-ul-custom">
            ${get(system).editing ? `
            <li>
                <button code="add" class="g6-contextmenu-button-custom">
                    <svg
                        code="add"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <rect code="add" x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <line code="add" x1="12" y1="8" x2="12" y2="16"></line>
                        <line code="add" x1="8" y1="12" x2="16" y2="12"></line>
                    </svg>
                    <span code="add">Add node</span>
                </button>
            </li>
            ` : ''}
            <li>
                <button code="center" class="g6-contextmenu-button-custom">
                <svg
                    code="center"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <polyline code="center" points="16.08 3.76 21.41 3.76 21.41 7.35"/>'
                    <polyline code="center" points="16.08 20.24 21.41 20.24 21.41 16.65"/>
                    <polyline code="center" points="8.2 3.76 2.71 3.76 2.71 7.35"/>
                    <polyline code="center" points="8.2 20.24 2.71 20.24 2.71 16.65"/>
                    <rect code="center" x="5.15" y="7.14" width="13.81" height="9.71"/>
                </svg>
                <span code="center">Center</span>
                </button>
            </li>
            <li>
                <button code="image" class="g6-contextmenu-button-custom">
                <svg
                    code="image"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <rect code="image" x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle code="image" cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline code="image" points="21 15 16 10 5 21"></polyline>
                </svg>
                <span code="image">Save Image</span>
                </button>
            </li>
            <li>
                <button code="duplicate" class="g6-contextmenu-button-custom">
                <svg
                    code="duplicate"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path code="duplicate" d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline code="duplicate" points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line code="duplicate" x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
                <span code="duplicate">Duplicate</span>
                </button>
            </li>
        </ul>
        `;
    },
    handleMenuClick: (target, itemId, graph) => {
        const code = Object.values(target.attributes)
                        .find((item) => item.name === 'code');
                        
        if(!code) {
            console.log('Misclicked');
            return;
        }

        const { value } = code;
        
        switch(value) {
            case 'add': {
                resetNeuron();
                neuronAction('create');
                getModal('nodeModal').show();
                break;
            }
            case 'center': {
                graph.fitCenter('render', { duration: 500 });
                break;
            }
            case 'image': {
                const fileName = 'graph' + new Date().toISOString().slice(0,10).replace(/-/g,"");
                graph.downloadFullImage(fileName);
                break;
            }
            case 'duplicate': {
                const nodes = graph.findIdByState('node', 'selected');
                const edges = graph.findIdByState('edge', 'selected');

                if (nodes.length === 0) return;

                const newNodes = [];
                nodes.forEach((n) => {
                    graph.setItemState(n, 'selected', false);
                    const node = graph.getNodeData(n);
                    node.data.x += 15;
                    node.data.y += 15;
                    const nodeId = addNode(node, graph);
                    newNodes.push(nodeId);
                });

                const newEdges = [];
                edges.forEach((e) => {
                    graph.setItemState(e, 'selected', false);
                    const edge = graph.getEdgeData(e);
                    const source = nodes.indexOf(edge.source);
                    const target = nodes.indexOf(edge.target);
                    if(source > -1 && target > -1) {
                        newEdges.push(addEdge({
                             ...edge,
                             source: newNodes[source],
                             target: newNodes[target],
                            },
                        graph));
                    }
                });

                for (const node of newNodes) {
                    graph.setItemState(node, 'selected', true);
                }

                for (const edge of newEdges) {
                    graph.setItemState(edge, 'selected', true);
                }
            }
            default:
                break;
        }
    },
};

const contextMenuEdge = {
    type: 'menu',
    key: 'edge-context-menu',
    trigger: 'contextmenu',
    className: 'g6-component-contextmenu-custom',
    itemTypes: ['edge'],
    getContent: (e) => {
        return `
        <ul class="g6-contextmenu-ul-custom">
            ${get(system).editing ? `
            <li>
                <button code="delete" class="g6-contextmenu-button-custom">
                    <svg
                        code="delete"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <circle code="delete" cx="12" cy="12" r="10"></circle>
                        <line code="delete" x1="15" y1="9" x2="9" y2="15"></line>
                        <line code="delete" x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                    <span code="delete">Delete edge</span>
                </button>
            </li>
            ` : 'no actions'}
        </ul>
        `;
    },
    handleMenuClick: (target, itemId, graph) => {
        const code = Object.values(target.attributes)
                        .find((item) => item.name === 'code');
        
        if(!code) {
            console.log('Misclicked');
            return;
        }

        const { value } = code;
        
        if(value === 'delete') {
            removeEdge(itemId, graph);
        }
    },
};

export { contextMenuNode, contextMenuCanvas, contextMenuEdge };