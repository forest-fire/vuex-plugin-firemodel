"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.watcher = () => ({
    ["WATCHER_STARTING" /* watcherStarting */](state, payload) {
        //
    },
    ["WATCHER_STARTED" /* watcherStarted */](state, payload) {
        state.watching = state.watching.concat(payload);
    },
    ["SERVER_STATE_SYNC" /* serverStateSync */](state, payload) {
        console.log("server state sync: ", payload);
    }
});
//# sourceMappingURL=watcher.js.map