"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.relationships = void 0;
const vue_1 = __importDefault(require("vue"));
exports.relationships = () => ({
    // LOCAL
    ["RELATIONSHIP_ADDED_LOCALLY" /* relationshipAddedLocally */](state, payload) {
        vue_1.default.set(state, "localOnly", Object.assign(Object.assign({}, state.localOnly), { [payload.transactionId]: payload }));
    },
    ["RELATIONSHIP_SET_LOCALLY" /* relationshipSetLocally */](state, payload) {
        vue_1.default.set(state, "localOnly", Object.assign(Object.assign({}, state.localOnly), { [payload.transactionId]: payload }));
    },
    ["RELATIONSHIP_REMOVED_LOCALLY" /* relationshipRemovedLocally */](state, payload) {
        vue_1.default.set(state, "localOnly", Object.assign(Object.assign({}, state.localOnly), { [payload.transactionId]: payload }));
    },
    // CONFIRMATION
    ["RELATIONSHIP_ADDED_CONFIRMATION" /* relationshipAddConfirmation */](state, payload) {
        const transactionId = payload.transactionId;
        const localOnly = Object.assign({}, state.localOnly);
        delete localOnly[transactionId];
        vue_1.default.set(state, "localOnly", localOnly);
    },
    ["RELATIONSHIP_REMOVED_CONFIRMATION" /* relationshipRemovedConfirmation */](state, payload) {
        const transactionId = payload.transactionId;
        const localOnly = Object.assign({}, state.localOnly);
        delete localOnly[transactionId];
        vue_1.default.set(state, "localOnly", localOnly);
    },
    ["RELATIONSHIP_SET_CONFIRMATION" /* relationshipSetConfirmation */](state, payload) {
        const transactionId = payload.transactionId;
        const localOnly = Object.assign({}, state.localOnly);
        delete localOnly[transactionId];
        vue_1.default.set(state, "localOnly", localOnly);
    },
    // ROLLBACK
    /**
     * Note: this and all rollback mutations remove their
     * entry from the `localOnly` state hash because the
     * action which called this will have ensured that the
     * actual properties that had been set locally were rolled
     * back already
     */
    ["RELATIONSHIP_ADDED_ROLLBACK" /* relationshipAddRollback */](state, payload) {
        delete state.localOnly[payload.transactionId];
    },
    ["RELATIONSHIP_REMOVED_ROLLBACK" /* relationshipRemovedRollback */](state, payload) {
        delete state.localOnly[payload.transactionId];
    },
    ["RELATIONSHIP_SET_ROLLBACK" /* relationshipSetRollback */](state, payload) {
        delete state.localOnly[payload.transactionId];
    }
});
//# sourceMappingURL=relationships.js.map