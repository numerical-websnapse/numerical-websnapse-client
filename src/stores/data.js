import { writable } from 'svelte/store';
import { get } from 'svelte/store';

export const images = writable({});

export const addImage = (id, image) => {
    images.update(images => {
        images[id] = image;
        return images;
    });
}

export const updateVarImage = (id, key, value) => {
    images.update(images => {
        images[id][key] = value;
        return images;
    });
}

export const deleteImage = (id) => {
    images.update(images => {
        delete images[id];
        return images;
    });
}

export const getImage = (id) => {
    return get(images)[id];
}
