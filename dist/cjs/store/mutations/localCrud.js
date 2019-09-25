"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = __importDefault(require("vue"));
exports.localCrud = () => ({
    ["ADDED_LOCALLY" /* addedLocally */](state, payload) {
        vue_1.default.set(state, "localOnly", Object.assign(Object.assign({}, state.localOnly), { [payload.transactionId]: payload }));
    },
    ["CHANGED_LOCALLY" /* changedLocally */](state, payload) {
        vue_1.default.set(state, "localOnly", Object.assign(Object.assign({}, state.localOnly), { [payload.transactionId]: payload }));
    },
    ["REMOVED_LOCALLY" /* removedLocally */](state, payload) {
        const localOnly = Object.assign({}, state.localOnly);
        delete localOnly[payload.transactionId];
        vue_1.default.set(state, "localOnly", localOnly);
    }
});
//# sourceMappingURL=localCrud.js.map