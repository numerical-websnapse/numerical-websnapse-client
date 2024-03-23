import { writable } from 'svelte/store';
import { get } from 'svelte/store';

export const tools = writable({
    controls: {
        show: true,
        active: 'default',
    },
    toolbars: {
        show: true,
        active: 'default',
    },
});

export const hideTools = () => {
    tools.update(tools => {
        tools.controls.show = false;
        tools.toolbars.show = false;
        return tools;
    });
}

export const showTools = () => {
    tools.update(tools => {
        tools.controls.show = true;
        tools.toolbars.show = true;
        return tools;
    });
}