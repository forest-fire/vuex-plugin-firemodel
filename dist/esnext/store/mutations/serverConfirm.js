export const serverConfirm = () => ({
    ["ADD_CONFIRMATION" /* serverAddConfirm */](state, payload) {
        delete state.localOnly[payload.transactionId];
    },
    ["CHANGE_CONFIRMATION" /* serverChangeConfirm */](state, payload) {
        delete state.localOnly[payload.transactionId];
    },
    ["REMOVE_CONFIRMATION" /* serverRemoveConfirm */](state, payload) {
        delete state.localOnly[payload.transactionId];
    }
});
