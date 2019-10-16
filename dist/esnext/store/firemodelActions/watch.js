import { FmEvents } from "firemodel";
import { determineLocalStateNode } from "../../shared/determineLocalStateNode";
export const watch = () => ({
    [FmEvents.WATCHER_STARTING]({ commit }, payload) {
        commit("WATCHER_STARTING" /* watcherStarting */, payload);
    },
    [FmEvents.WATCHER_STARTED]({ commit }, payload) {
        commit("WATCHER_STARTED" /* watcherStarted */, payload);
    },
    /**
     * When getting a SYNC action from a watcher starting, pass this to the
     * appropriate local state node
     */
    [FmEvents.WATCHER_SYNC]({ commit, rootState }, payload) {
        console.log("watcher sync action", payload);
        commit(determineLocalStateNode(payload, "SERVER_STATE_SYNC" /* serverStateSync */), payload);
    }
});
