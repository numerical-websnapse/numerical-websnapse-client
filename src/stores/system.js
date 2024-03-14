import { writable } from 'svelte/store';

export const system = writable({
    time: 0,
    prev: 0, // Used for time slider
    guided: false,
    simulating: false,
    running: false,
    editing: true,
    dev: true,
    mode: 'default',
    tickRate: 1500,
    iterations: 1,  //Infinity,
    spike:[],
    history: [],
    environment: [],
    config: {}, // current config details
    matrices: {}, // store the matrices for the current config
    choice: {
        spike: null,
        active: [],
        random: {}, // object containing the pseudorandom checks for guided mode
    }, // store index of the spike chosen (should be the index since we still need to get the the next config and environment details from the index of the spike chosen)
    order: {},
    url: 'ws://localhost:8000/ws',
});

export const resetSystem = () => {
    system.update(system => {
        system.time = 0;
        system.prev = 0;
        system.guided = false;
        system.simulating = false;
        system.running = false;
        system.editing = true;
        system.mode = 'default';
        system.tickRate = 2000;
        system.iterations = 1;
        system.spike = [];
        system.history = [];
        system.environment = [];
        system.config = {};
        system.matrices = {};
        system.choice = {
            spike: null,
            active: [],
            random: {},
        };
        system.order = {};
        return system;
    });
}