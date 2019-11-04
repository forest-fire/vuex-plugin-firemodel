import { FmEvents } from "firemodel";
import { determineLocalStateNode } from "../../shared/determineLocalStateNode";
export const watch = () => ({
    [FmEvents.WATCHER_STARTING]({ commit }, payload) {
        commit("WATCHER_STARTING" /* watcherStarting */, payload);
    },
    [FmEvents.WATCHER_STARTED]({ commit }, payload) {
        commit("WATCHER_STARTED" /* watcherStarted */, payload);
    },
    [FmEvents.WATCHER_STOPPED]({ commit }, payload) {
        commit("WATCHER_STOPPED" /* watcherStopped */, payload);
    },
    [FmEvents.WATCHER_FAILED]({ commit }, payload) {
        commit("WATCHER_FAILED" /* watcherFailed */, payload);
        console.warn(`Watcher ${payload.watcherId} failed to start!`);
    },
    [FmEvents.WATCHER_STOPPED_ALL]({ commit }, payload) {
        commit("WATCHER_STOPPED_ALL" /* watcherAllStopped */, payload);
    },
    /**
     * When getting a SYNC action from a watcher starting, pass this to the
     * appropriate local state node
     */
    async [FmEvents.WATCHER_SYNC]({ commit }, payload) {
        commit("WATCHER_MUTED" /* watcherMuted */, payload.watcherId);
        commit(determineLocalStateNode(payload, "SERVER_STATE_SYNC" /* serverStateSync */), payload, { root: true });
        setTimeout(() => {
            commit("WATCHER_UNMUTED" /* watcherUnmuted */, payload.watcherId);
        }, 3000);
    }
});
