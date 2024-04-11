import { writable } from 'svelte/store';

let isDark = localStorage.getItem('theme') === 'dark' || false;
let drawMode = localStorage.getItem('nodeView') || 'text';
let enableAnimation = localStorage.getItem('animate') === 'true' || false;
export const dark = writable(isDark);

export const nodeOptions = writable({
    label: {
        offset: 23,
        margin: 6,
    },
    content: {
        padding: 20,
        paddingSimple: 6,
        divider: 15,
        fill: isDark ? '#FFFFFF' : '#000000',
    },
    keyShape: {
        lineWidth: 1,
        defaultWidth: 50,
        defaultHeight: 50,
        radius: 15,
        fill: isDark ? '#333333' : '#FFFFFF',
        stroke: isDark ? '#C2C2C2' : '#000000',
    },
    haloShape: {
        stroke: isDark ? '#70A0FF' : '#2E2EFF',
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
        fill: isDark ? '#333333' : '#FFFFFF',
        stroke: isDark ? '#C2C2C2' : '#000000',
    },
    inShape: {
        padding: 10,
        lineWidth: 1,
        defaultWidth: 50,
        defaultHeight: 50,
        radius: 15,
        row: 5,
        supressInput: true,
        supressCount: 5,
        fill: isDark ? '#333333' : '#FFFFFF',
        stroke: isDark ? '#C2C2C2' : '#000000',
    },
    draw: {
        mode: drawMode,
    }
})

export const edgeOptions = writable({
    animation: {
        enabled: enableAnimation,
        autoDisable: true,
        autoDisableCount: 256,
    },
    keyShape: {
        stroke: isDark ? '#FFFFFF' : '#000000',
        lineWidth: 1,
    },
    endArrow: {
        stroke: isDark ? '#FFFFFF' : '#000000',
        fill: isDark ? '#FFFFFF' : '#000000',
        path: 'M 0,0 L 12,6 L 9,0 L 12,-6 Z',
    },
    spikeShape: {
        r: 4,
        fill : isDark ? '#B8CCFF' : '#1E429F',
    }
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

export const graphOptions = writable({
    themes: {
        light: {
			type: 'spec',
			base: 'light',
			specification: {
				canvas: {
					backgroundColor: '#ffffff',
				},
			}
		},
        dark: {
			type: 'spec',
			base: 'dark',
			specification: {
				canvas: {
					backgroundColor: '#222222',
				},
			}
		},
    },
    grids: {
        light: {
            key: 'default-grid',
            type: 'grid',
            img: `url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTIxIDIwQzIxIDIwLjU1MjMgMjAuNTUyMyAyMSAyMCAyMUMxOS40NDc3IDIxIDE5IDIwLjU1MjMgMTkgMjBDMTkgMTkuNDQ3NyAxOS40NDc3IDE5IDIwIDE5QzIwLjU1MjMgMTkgMjEgMTkuNDQ3NyAyMSAyMFoiIGZpbGw9ImJsYWNrIiBmaWxsLW9wYWNpdHk9IjAuNSIvPgo8L3N2Zz4=)`,
        },
        dark: {
            key: 'default-grid',
            type: 'grid',
            img: `url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTIxIDIwQzIxIDIwLjU1MjMgMjAuNTUyMyAyMSAyMCAyMUMxOS40NDc3IDIxIDE5IDIwLjU1MjMgMTkgMjBDMTkgMTkuNDQ3NyAxOS40NDc3IDE5IDIwIDE5QzIwLjU1MjMgMTkgMjEgMTkuNDQ3NyAyMSAyMFoiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNSIvPgo8L3N2Zz4=)`,
        }
    },
});

export const applyTheme = (theme) => {
    isDark = theme === 'dark';

    nodeOptions.update(nodeOptions => {
        nodeOptions.content.fill = isDark ? '#FFFFFF' : '#000000';
        nodeOptions.keyShape.fill = isDark ? '#333333' : '#FFFFFF';
        nodeOptions.keyShape.stroke = isDark ? '#FFFFFF' : '#000000';
        nodeOptions.haloShape.stroke = isDark ? '#70A0FF' : '#2E2EFF';
        nodeOptions.outShape.fill = isDark ? '#333333' : '#FFFFFF';
        nodeOptions.outShape.stroke = isDark ? '#FFFFFF' : '#000000';
        nodeOptions.inShape.fill = isDark ? '#333333' : '#FFFFFF';
        nodeOptions.inShape.stroke = isDark ? '#FFFFFF' : '#000000';
        return nodeOptions;
    });

    edgeOptions.update(edgeOptions => {
        edgeOptions.keyShape.stroke = isDark ? '#FFFFFF' : '#000000';
        edgeOptions.endArrow.stroke = isDark ? '#FFFFFF' : '#000000';
        edgeOptions.endArrow.fill = isDark ? '#FFFFFF' : '#000000';
        edgeOptions.spikeShape.fill = isDark ? '#B8CCFF' : '#1E429F';
        return edgeOptions;
    });

    dark.set(isDark);
}

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
            fill: {
                name: 'Fill',
                visible: true,
                type: 'color',
            }
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
    inShape: {
        name: 'Input Shape',
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
            supressInput: {
                name: 'Supress Input',
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
    animation: {
        name: 'Animation',
        visible: true,
        type: 'object',
        value: {
            enabled: {
                name: 'Enabled',
                visible: true,
                type: 'boolean',
            },
            autoDisable: {
                name: 'Auto-disable',
                visible: true,
                type: 'boolean',
            },
            autoDisableCount: {
                name: 'Synapse Count',
                visible: true,
                type: 'number',
            }
        }
    },
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
    spikeShape: {
        name: 'Spike Shape',
        visible: true,
        type: 'object',
        value: {
            r: {
                name: 'Radius',
                visible: true,
                type: 'number',
            },
            fill: {
                name: 'Stroke',
                visible: true,
                type: 'color',
            },
        }
    }
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