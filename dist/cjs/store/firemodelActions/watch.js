"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firemodel_1 = require("firemodel");
const determineLocalStateNode_1 = require("../../shared/determineLocalStateNode");
exports.watch = () => ({
    [firemodel_1.FmEvents.WATCHER_STARTING]({ commit }, payload) {
        commit("WATCHER_STARTING" /* watcherStarting */, payload);
    },
    [firemodel_1.FmEvents.WATCHER_STARTED]({ commit }, payload) {
        commit("WATCHER_STARTED" /* watcherStarted */, payload);
    },
    [firemodel_1.FmEvents.WATCHER_STOPPED]({ commit }, payload) {
        console.log("Watcher stopped", payload);
    },
    [firemodel_1.FmEvents.WATCHER_STOPPED_ALL]({ commit }, payload) {
        console.log("All watchers stopped", payload);
    },
    /**
     * When getting a SYNC action from a watcher starting, pass this to the
     * appropriate local state node
     */
    async [firemodel_1.FmEvents.WATCHER_SYNC]({ commit }, payload) {
        commit("WATCHER_MUTED" /* watcherMuted */, payload.watcherId);
        commit(determineLocalStateNode_1.determineLocalStateNode(payload, "SERVER_STATE_SYNC" /* serverStateSync */), payload, { root: true });
        setTimeout(() => {
            commit("WATCHER_UNMUTED" /* watcherUnmuted */, payload.watcherId);
        }, 3000);
    }
});
//# sourceMappingURL=watch.js.map