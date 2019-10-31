"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = __importDefault(require("vue"));
exports.watcher = () => ({
    ["WATCHER_STARTING" /* watcherStarting */](state, payload) {
        // nothing to do
    },
    ["WATCHER_STARTED" /* watcherStarted */](state, payload) {
        vue_1.default.set(state, "watching", state.watching ? state.watching.concat(payload) : [payload]);
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
//# sourceMappingURL=watcher.js.map