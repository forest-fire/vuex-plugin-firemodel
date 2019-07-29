"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.localCrud = () => ({
    ["ADDED_LOCALLY" /* addedLocally */](state, payload) {
        state.localOnly[payload.transactionId] = payload;
    },
    ["CHANGED_LOCALLY" /* changedLocally */](state, payload) {
        state.localOnly[payload.transactionId] = payload;
    },
    ["REMOVED_LOCALLY" /* removedLocally */](state, payload) {
        state.localOnly[payload.transactionId] = payload;
    }
});
//# sourceMappingURL=localCrud.js.map