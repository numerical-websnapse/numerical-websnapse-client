import { writable } from 'svelte/store';
import { Modal } from 'flowbite';

export const modals = writable({
    nodeModal: 'node-modal',
    settingModal : 'setting-modal',
    guidedModal: 'guided-modal',
    historyModal: 'history-modal',
    neuronAction: null,
    guided:{
        submitButton: 'submit-guided-button',
        cancelButton: 'cancel-guided-button',
    }
});

export const neuronAction = (action) => {
    modals.update((modal) => {
        modal.neuronAction = action;
        return modal;
    });
}

export const getModal = (id, options=true) => {
    let temp = null;

    const defaultOptions = {
        backdrop: 'dynamic',
        closable: false,
    };

    const unsubscribe = modals.subscribe((modal) => {
        if (typeof options === 'boolean') {
            temp = options ? new Modal(document.getElementById(modal[id]), defaultOptions)
                           : new Modal(document.getElementById(modal[id]));
        }

        if (typeof options === 'object') {
            temp = new Modal(document.getElementById(modal[id]), options);
        }
    });
    
    unsubscribe();
    return temp;
}

export const modalElementId = (id) => {
    return new Modal(document.getElementById(id));
}