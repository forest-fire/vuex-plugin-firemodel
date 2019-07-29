export const watcher = () => ({
    ["WATCHER_STARTING" /* watcherStarting */](state, payload) {
        //
    },
    ["WATCHER_STARTED" /* watcherStarted */](state, payload) {
        state.watching = state.watching.concat(payload);
    }
});
