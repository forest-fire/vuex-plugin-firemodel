"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * **since**
 *
 * Gets all records _since_ a certain timestamp (`epoch` with milliseconds)
 */
let since = function since(defn) {
    return function all(defn) {
        return async (command, ctx) => { };
    };
};
exports.since = since;
since.prototype.isQueryHelper = true;
//# sourceMappingURL=since.js.map