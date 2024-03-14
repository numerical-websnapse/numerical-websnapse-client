export const objectsMatch = (obj1, obj2) => {
    // Get the keys of each object
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    // Check if the number of keys is the same
    if (keys1.length !== keys2.length) {
        return false;
    }

    // Iterate over keys and compare values
    for (let key of keys1) {
        // Check if the key exists in both objects
        if (!obj2.hasOwnProperty(key)) {
            return false;
        }

        // Get the values for the current key
        const val1 = obj1[key];
        const val2 = obj2[key];

        // Check if either value is null
        if (val1 === null || val2 === null) {
            // If one is null and the other is not, they don't match
            if (val1 !== val2) {
                return false;
            }
            // If both are null, continue to the next key
            continue;
        }

        // Check if both values are objects
        if (typeof val1 === 'object' && typeof val2 === 'object') {
            // Recursively compare nested objects
            if (!objectsMatch(val1, val2)) {
                return false;
            }
        } else {
            // Compare the values of the current key
            if (val1 !== val2) {
                return false;
            }
        }
    }

    // If all keys and values match, return true
    return true;
}