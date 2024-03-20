import { writable, get } from 'svelte/store';
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

export const checkOpenModal = () => {
    const modals_ = get(modals);
    for(const modal in modals_) {
        if (modal.includes('Modal')) {
            const myElement = document.getElementById(modals_[modal]);
            const ariaModalValue = myElement.getAttribute('aria-modal');
            if (ariaModalValue) return true;
        }
    }

    return false;
};

export const checkOpenModalById = (id) => {
    const modal = document.getElementById(id);
    console.log(modal);
    if(!modal) return false;
    const ariaModalValue = modal.getAttribute('aria-modal');
    if (ariaModalValue) return true;
    return false;
}