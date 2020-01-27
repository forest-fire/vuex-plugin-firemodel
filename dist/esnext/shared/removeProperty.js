/**
 * Removes a property (or set of properties) from a hash/dictionary
 */
export function removeProperty(hash, ...remove) {
    const output = {};
    Object.keys(hash)
        .filter((prop) => !remove.includes(prop))
        .forEach((prop) => output[prop] = hash[prop]);
    return output;
}
