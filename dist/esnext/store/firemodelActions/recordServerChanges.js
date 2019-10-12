import { FmEvents } from "firemodel";
import { determineLocalStateNode } from "../../shared/determineLocalStateNode";
export const recordServerChanges = () => ({
    [FmEvents.RECORD_ADDED]({ commit }, payload) {
        commit(determineLocalStateNode(payload, "SERVER_ADD" /* serverAdd */), payload, {
            root: true
        });
    },
    [FmEvents.RECORD_REMOVED]({ commit }, payload) {
        commit(determineLocalStateNode(payload, "SERVER_REMOVE" /* serverRemove */), payload, {
            root: true
        });
    },
    [FmEvents.RECORD_CHANGED](store, payload) {
        // Send mutation to appropriate state node
        this.commit(determineLocalStateNode(payload, "SERVER_CHANGE" /* serverChange */), payload, {
            root: true
        });
    }
});
