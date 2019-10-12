import Vue from "vue";
export const localCrud = () => ({
    ["ADDED_LOCALLY" /* addedLocally */](state, payload) {
        Vue.set(state, "localOnly", Object.assign(Object.assign({}, state.localOnly), { [payload.transactionId]: payload }));
    },
    ["CHANGED_LOCALLY" /* changedLocally */](state, payload) {
        Vue.set(state, "localOnly", Object.assign(Object.assign({}, state.localOnly), { [payload.transactionId]: payload }));
    },
    ["REMOVED_LOCALLY" /* removedLocally */](state, payload) {
        const localOnly = Object.assign({}, state.localOnly);
        delete localOnly[payload.transactionId];
        Vue.set(state, "localOnly", localOnly);
    }
});
