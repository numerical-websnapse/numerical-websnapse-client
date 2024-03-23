import { edgeOptions } from '../../stores/settings';
import { system } from '../../stores/system';
import { get } from 'svelte/store';

export const edgeAnimation = () => {
    const config = get(edgeOptions);
    const systemConfig = get(system);
    
    return {
        update: [
            // {
            //     fields: ['lineDash'],
            //     shapeId: 'growShape',
            //     states: ['Spiking'],
            //     iterations: systemConfig.iterations,
            //     direction: config.growShape.direction,
            //     duration: systemConfig.tickRate,
            // },
            // {
            //     fields: ['stroke'],
            //     shapeId: 'colorShape',
            //     states: ['Spiking'],
            //     iterations: systemConfig.iterations,
            //     duration: systemConfig.tickRate,
            // },
            // {
            //     fields: ['lineDash'],
            //     shapeId: 'keyShape',
            //     states: ['Spiking'],
            //     iterations: systemConfig.iterations,
            //     duration: systemConfig.tickRate,
            // },
            {
                fields: ['offsetDistance'],
                shapeId: 'spikeShape',
                states: ['Spiking'],
                iterations: systemConfig.iterations,
                duration: systemConfig.tickRate,
            },
        ],
    }
}