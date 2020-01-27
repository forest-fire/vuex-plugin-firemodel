"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * **since**
 *
 * Gets all records _since_ a certain timestamp (`epoch` with milliseconds)
 */
let since = function since(timestamp) {
    return (command, context) => {
        // if indexedDB, get from IndexedDb
        // 
        return Promise.resolve([]);
    };
};
exports.since = since;
since.prototype.isQueryHelper = true;
//# sourceMappingURL=since.js.map