"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.watcher = () => ({
    ["WATCHER_STARTING" /* watcherStarting */](state, payload) {
        //
    },
    ["WATCHER_STARTED" /* watcherStarted */](state, payload) {
        state.watching = state.watching.concat(payload);
    }
});
//# sourceMappingURL=watcher.js.map