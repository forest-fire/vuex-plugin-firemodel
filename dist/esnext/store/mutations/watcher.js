import Vue from "vue";
export const watcher = () => ({
    ["WATCHER_STARTING" /* watcherStarting */](state, payload) {
        // nothing to do
    },
    ["WATCHER_STARTED" /* watcherStarted */](state, payload) {
        Vue.set(state, "watching", state.watching ? state.watching.concat(payload) : [payload]);
    },
    ["WATCHER_STOPPED" /* watcherStopped */](state, payload) {
        state.watching = state.watching.filter(i => i.watcherId !== payload.watcherId);
    },
    ["WATCHER_STOPPED_ALL" /* watcherAllStopped */](state, payload) {
        state.watching = [];
    },
    ["WATCHER_MUTED" /* watcherMuted */](state, watcherId) {
        state.muted = state.muted.concat(watcherId);
    },
    ["WATCHER_UNMUTED" /* watcherUnmuted */](state, watcherId) {
        state.muted = state.muted.filter(i => i !== watcherId);
    }
});
