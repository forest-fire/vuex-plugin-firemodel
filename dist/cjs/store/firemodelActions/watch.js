"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.watch = void 0;
const firemodel_1 = require("firemodel");
const shared_1 = require("../../shared");
exports.watch = () => ({
    [firemodel_1.FmEvents.WATCHER_STARTING]({ commit }, payload) {
        commit("WATCHER_STARTING" /* watcherStarting */, payload);
    },
    [firemodel_1.FmEvents.WATCHER_STARTED]({ commit }, payload) {
        commit("WATCHER_STARTED" /* watcherStarted */, payload);
    },
    [firemodel_1.FmEvents.WATCHER_STOPPED]({ commit }, payload) {
        commit("WATCHER_STOPPED" /* watcherStopped */, payload);
    },
    [firemodel_1.FmEvents.WATCHER_FAILED]({ commit }, payload) {
        commit("WATCHER_FAILED" /* watcherFailed */, payload);
        console.warn(`Watcher ${payload.watcherId} failed to start!`);
    },
    [firemodel_1.FmEvents.WATCHER_STOPPED_ALL]({ commit }, payload) {
        commit("WATCHER_STOPPED_ALL" /* watcherAllStopped */, payload);
    },
    /**
     * When getting a SYNC action from a watcher starting, pass this to the
     * appropriate local state node
     */
    async [firemodel_1.FmEvents.WATCHER_SYNC]({ commit }, payload) {
        commit("WATCHER_MUTED" /* watcherMuted */, payload.watcherId);
        commit(shared_1.determineLocalStateNode(payload, "SERVER_STATE_SYNC" /* serverStateSync */), payload, { root: true });
        setTimeout(() => {
            commit("WATCHER_UNMUTED" /* watcherUnmuted */, payload.watcherId);
        }, 3000);
    }
});
//# sourceMappingURL=watch.js.map