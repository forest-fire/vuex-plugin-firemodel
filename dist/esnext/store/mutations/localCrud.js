export const localCrud = () => ({
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
