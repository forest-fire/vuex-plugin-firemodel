"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = __importDefault(require("vue"));
exports.serverConfirm = () => ({
    /**
     * When a change has been made
     */
    ["ADD_CONFIRMATION" /* serverAddConfirm */](state, payload) {
        delete state.localOnly[payload.transactionId];
    },
    ["CHANGE_CONFIRMATION" /* serverChangeConfirm */](state, payload) {
        const transactionId = payload.transactionId;
        const localOnly = Object.assign({}, state.localOnly);
        delete localOnly[transactionId];
        vue_1.default.set(state, "localOnly", localOnly);
        // delete state.localOnly[payload.transactionId];
    },
    /**
     * Removes the `localOnly` reference to a transaction once the server
     * has confirmed it.
     */
    ["REMOVE_CONFIRMATION" /* serverRemoveConfirm */](state, payload) {
        const transactionId = payload.transactionId;
        const localOnly = Object.assign({}, state.localOnly);
        delete localOnly[transactionId];
        vue_1.default.set(state, "localOnly", localOnly);
    },
    ["RELATIONSHIP_ADDED_ROLLBACK" /* relationshipAddRollback */](state, payload) {
        const transactionId = payload.transactionId;
        const localOnly = Object.assign({}, state.localOnly);
        delete localOnly[transactionId];
        vue_1.default.set(state, "localOnly", localOnly);
        console.info(`Rolled back changes made locally [ transaction id: ${transactionId} ]`);
    }
});
//# sourceMappingURL=serverConfirm copy.js.map