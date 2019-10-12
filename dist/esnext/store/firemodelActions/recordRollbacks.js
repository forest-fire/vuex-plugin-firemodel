import { FmEvents } from "firemodel";
import { determineLocalStateNode } from "../../shared/determineLocalStateNode";
export const recordRollbacks = () => ({
    [FmEvents.RECORD_ADDED_ROLLBACK]({ commit, state }, payload) {
        commit("ROLLBACK_ADD" /* serverAddRollback */, payload);
        commit(determineLocalStateNode(payload, "ROLLBACK_ADD" /* serverAddRollback */), payload, {
            root: true
        });
    },
    [FmEvents.RECORD_CHANGED_ROLLBACK]({ commit, state }, payload) {
        commit("ROLLBACK_CHANGE" /* serverChangeRollback */, payload);
        commit(determineLocalStateNode(payload, "ROLLBACK_CHANGE" /* serverChangeRollback */), payload, {
            root: true
        });
    },
    [FmEvents.RECORD_REMOVED_ROLLBACK]({ commit, state }, payload) {
        commit("ROLLBACK_REMOVE" /* serverRemoveRollback */, payload);
        commit(determineLocalStateNode(payload, "ROLLBACK_REMOVE" /* serverRemoveRollback */), payload, {
            root: true
        });
    }
});
