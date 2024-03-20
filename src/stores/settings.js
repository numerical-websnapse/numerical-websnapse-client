import { writable } from 'svelte/store';

export const nodeOptions = writable({
    label: {
        offset: 23,
        margin: 6,
    },
    content: {
        padding: 20,
        paddingSimple: 6,
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
    },
    draw: {
        mode: 'text',
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

export const nodeMetaData = {
    label: {
        name: 'Label',
        visible: true,
        type: 'object',
        value: {
            offset: {
                name: 'Offset',
                visible: true,
                type: 'number',
            },
            margin: {
                name: 'Margin',
                visible: true,
                type: 'number',
            },
        }
    },
    content: {
        name: 'Content',
        visible: true,
        type: 'object',
        value: {
            padding: {
                name: 'Padding',
                visible: true,
                type: 'number',
            },
            paddingSimple: {
                name: 'Padding: Simple mode',
                visible: true,
                type: 'number',
            },
            divider: {
                name: 'Divider',
                visible: true,
                type: 'number',
            },
        }
    },
    keyShape: {
        name: 'Key Shape',
        visible: true,
        type: 'object',
        value: {
            lineWidth: {
                name: 'Line width',
                visible: true,
                type: 'number',
            },
            defaultWidth: {
                name: 'Default width',
                visible: true,
                type: 'number',
            },
            defaultHeight: {
                name: 'Default height',
                visible: true,
                type: 'number',
            },
            radius: {
                name: 'Radius',
                visible: true,
                type: 'number',
            },
            fill: {
                name: 'Fill',
                visible: true,
                type: 'color',
            },
            stroke: {
                name: 'Stroke',
                visible: true,
                type: 'color',
            },
        }
    },
    haloShape: {
        name: 'Halo Shape',
        visible: true,
        type: 'object',
        value: {
            stroke: {
                name: 'Stroke',
                visible: true,
                type: 'color',
            },
        }
    },
    outShape: {
        name: 'Output Shape',
        visible: true,
        type: 'object',
        value: {
            padding: {
                name: 'Padding',
                visible: true,
                type: 'number',
            },
            lineWidth: {
                name: 'Line width',
                visible: true,
                type: 'number',
            },
            defaultWidth: {
                name: 'Default width',
                visible: true,
                type: 'number',
            },
            defaultHeight: {
                name: 'Default height',
                visible: true,
                type: 'number',
            },
            radius:{
                name: 'Radius',
                visible: true,
                type: 'number',
            },
            row: {
                name: 'Row',
                visible: true,
                type: 'number',
            },
            supressOutput: {
                name: 'Supress output',
                visible: true,
                type: 'boolean',
            },
            supressCount: {
                name: 'Supress count',
                visible: true,
                type: 'number',
            },
            fill: {
                name: 'Fill',
                visible: true,
                type: 'color',
            },
            stroke: {
                name: 'Stroke',
                visible: true,
                type: 'color',
            },
        }
    },
    draw: {
        name: 'Draw',
        visible: false,
        type: 'object',
        value: {
            mode: {
                name: 'Mode',
                visible: false,
                type: 'string',
            },
        }
    }
}

export const edgeMetaData = {
    keyShape: {
        name: 'Key Shape',
        visible: true,
        type: 'object',
        value: {
            stroke: {
                name: 'Stroke',
                visible: true,
                type: 'color',
            },
            lineWidth: {
                name: 'Line width',
                visible: true,
                type: 'number',
            },
        }
    },
    endArrow: {
        name: 'End Arrow',
        visible: true,
        type: 'object',
        value: {
            stroke: {
                name: 'Stroke',
                visible: true,
                type: 'color',
            },
            fill: {
                name: 'Fill',
                visible: true,
                type: 'color',
            },
            path: {
                name: 'Path',
                visible: true,
                type: 'path',
            },
        }
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
}