"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeProperty = void 0;
/**
 * Removes a property (or set of properties) from a hash/dictionary
 */
function removeProperty(hash, ...remove) {
    const output = {};
    Object.keys(hash)
        .filter((prop) => !remove.includes(prop))
        .forEach((prop) => output[prop] = hash[prop]);
    return output;
}
exports.removeProperty = removeProperty;
//# sourceMappingURL=removeProperty.js.map