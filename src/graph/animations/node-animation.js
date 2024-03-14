import { system } from '../../stores/system';
import { get } from 'svelte/store';

export const nodeAnimation = () => {
    const config = get(system);

    return {
        update: [
            {
                fields: ['lineWidth'],
                shapeId: 'keyShape',
                states: ['selected'],
            },
            {
                fields: ['stroke'],
                shapeId: 'keyShape',
                states: ['Spiking'],
            },
        ]
    }
};