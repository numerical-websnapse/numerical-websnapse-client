export const nestedDelete = (obj) => {
    for (const key in obj) {
        if (obj[key] instanceof Object) {
            nestedDelete(obj[key]);
        } else {
            delete obj[key];
        }
    }

    obj = null;
}