"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.localCrud = {
    ["ADDED_LOCALLY" /* addedLocally */](state, payload) {
        const p = payload;
        state.localOnly = state.localOnly.concat({
            action: "add",
            dbPath: p.dbPath,
            localPath: p.localPath,
            value: p.value,
            timestamp: new Date().getTime()
        });
    },
    ["CHANGED_LOCALLY" /* changedLocally */](state, payload) {
        const p = payload;
        state.localOnly = state.localOnly.concat({
            action: "update",
            dbPath: p.dbPath,
            localPath: p.localPath,
            value: p.value,
            timestamp: new Date().getTime()
        });
    }
};
//# sourceMappingURL=localCrud.js.map