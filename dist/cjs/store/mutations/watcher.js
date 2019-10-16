"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.watcher = () => ({
    ["WATCHER_STARTING" /* watcherStarting */](state, payload) {
        //
    },
    ["WATCHER_STARTED" /* watcherStarted */](state, payload) {
        state.watching = state.watching.concat(payload);
    },
    ["WATCHER_MUTED" /* watcherMuted */](state, watcherId) {
        state.muted = state.muted.concat(watcherId);
    },
    ["WATCHER_UNMUTED" /* watcherUnmuted */](state, watcherId) {
        state.muted = state.muted.filter(i => i !== watcherId);
    }
});
//# sourceMappingURL=watcher.js.map