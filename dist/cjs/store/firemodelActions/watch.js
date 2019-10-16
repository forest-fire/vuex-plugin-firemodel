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
    /**
     * When getting a SYNC action from a watcher starting, pass this to the
     * appropriate local state node
     */
    [firemodel_1.FmEvents.WATCHER_SYNC]({ commit, rootState }, payload) {
        console.log("watcher sync action", payload);
        commit(determineLocalStateNode_1.determineLocalStateNode(payload, "SERVER_STATE_SYNC" /* serverStateSync */), payload);
    }
});
//# sourceMappingURL=watch.js.map