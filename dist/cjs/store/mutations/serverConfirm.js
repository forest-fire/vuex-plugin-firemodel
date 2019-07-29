"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverConfirm = () => ({
    ["ADD_CONFIRMATION" /* serverAddConfirm */](state, payload) {
        state.localOnly = state.localOnly.filter(i => i.dbPath !== payload.dbPath);
    },
    ["CHANGE_CONFIRMATION" /* serverChangeConfirm */](state, payload) {
        state.localOnly = state.localOnly.filter(i => i.dbPath !== payload.dbPath);
    },
    ["REMOVE_CONFIRMATION" /* serverRemoveConfirm */](state, payload) {
        state.localOnly = state.localOnly.filter(i => i.dbPath !== payload.dbPath);
    }
});
//# sourceMappingURL=serverConfirm.js.map