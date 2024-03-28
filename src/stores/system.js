import { writable } from 'svelte/store';

export const system = writable({
    time: 0,
    prev: 0,
    guided: false,
    simulating: false,
    running: false,
    editing: true,
    dev: false,
    mode: 'default',
    tickRate: 1500,
    iterations: 1,  //Infinity,
    edgeCount: 0,
    spike:[],
    history: [],
    environment: [],
    config: {},
    matrices: {},
    choice: {
        spike: null,
        active: [],
        random: {},
    },
    order: {},
    // url: '127.0.0.1:8000',
    url: 'numerical-websnapse-server.onrender.com',
    client: null,
    socket: null,
});

export const resetSystem = () => {
    system.update(system => {
        system.time = 0;
        system.prev = 0;
        system.guided = false;
        system.simulating = false;
        system.running = false;
        system.editing = true;
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