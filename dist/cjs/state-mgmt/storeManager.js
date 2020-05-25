"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStore = exports.preserveStore = void 0;
let _store;
function preserveStore(store) {
    _store = store;
}
exports.preserveStore = preserveStore;
function getStore() {
    return _store;
}
exports.getStore = getStore;
//# sourceMappingURL=storeManager.js.map