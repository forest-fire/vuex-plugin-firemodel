import { FmEvents } from "firemodel";
import { determineLocalStateNode } from "../../shared/determineLocalStateNode";
export const recordServerChanges = () => ({
    [FmEvents.RECORD_ADDED]({ commit, state }, payload) {
        if (!state.muted.includes(payload.watcherId)) {
            try {
                commit(determineLocalStateNode(payload, "SERVER_ADD" /* serverAdd */), payload, {
                    root: true
                });
            }
            catch (e) {
                console.error(`Problem with mutation ${determineLocalStateNode(payload, "SERVER_ADD" /* serverAdd */)}. Payload was: ${payload}\n\nError was: ${e.message}`);
            }
        }
    },
    [FmEvents.RECORD_REMOVED]({ commit }, payload) {
        commit(determineLocalStateNode(payload, "SERVER_REMOVE" /* serverRemove */), payload, {
            root: true
        });
    },
    [FmEvents.RECORD_MOVED]({ commit }, payload) {
        console.info("A RECORD_MOVED action was received", payload);
    },
    [FmEvents.RECORD_CHANGED](store, payload) {
        try {
            this.commit(determineLocalStateNode(payload, "SERVER_CHANGE" /* serverChange */), payload, {
                root: true
            });
        }
        catch (e) {
            console.error(`Problem with mutation ${determineLocalStateNode(payload, "SERVER_ADD" /* serverAdd */)}. Payload was: ${payload}.\n\nError was: ${e.message}`);
        }
    }
});
