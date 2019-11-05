import Vue from "vue";
export const serverRollback = () => ({
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
        Vue.set(state, "localOnly", localOnly);
        console.info(`Rolled back changes made locally [ transaction id: ${transactionId} ]`);
    }
});
