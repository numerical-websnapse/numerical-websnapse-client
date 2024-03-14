export const deepCopy = (obj) => {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    const newObject = Array.isArray(obj) ? [] : {};

    for (let key in obj) {
      newObject[key] = deepCopy(obj[key]);
    }

    return newObject;
}