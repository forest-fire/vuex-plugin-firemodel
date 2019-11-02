"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = __importDefault(require("vue"));
exports.serverRollback = () => ({
    /**
     * Local ADD must be rolled back
     */
    ["ROLLBACK_ADD" /* serverAddRollback */](state, payload) {
        // TODO: implement
    },
    ["ROLLBACK_CHANGE" /* serverChangeRollback */](state, payload) {
        // TODO: implement
    },
    /**
     * Removes the `localOnly` reference to a transaction once the server
     * has confirmed it.
     */
    ["ROLLBACK_REMOVE" /* serverRemoveRollback */](state, payload) {
        // TODO: implement
    },
    ["RELATIONSHIP_ADDED_ROLLBACK" /* relationshipAddRollback */](state, payload) {
        const transactionId = payload.transactionId;
        const localOnly = Object.assign({}, state.localOnly);
        delete localOnly[transactionId];
        vue_1.default.set(state, "localOnly", localOnly);
        console.info(`Rolled back changes made locally [ transaction id: ${transactionId} ]`);
    }
});
//# sourceMappingURL=serverRollback.js.map