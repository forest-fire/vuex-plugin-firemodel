import { FmEvents } from "firemodel";
import { determineLocalStateNode } from "../../shared/determineLocalStateNode";
export const recordConfirms = () => ({
    [FmEvents.RECORD_ADDED_CONFIRMATION]({ commit, state }, payload) {
        commit("ADD_CONFIRMATION" /* serverAddConfirm */, payload);
        commit(determineLocalStateNode(payload, "ADD_CONFIRMATION" /* serverAddConfirm */), payload, {
            root: true
        });
    },
    [FmEvents.RECORD_CHANGED_CONFIRMATION]({ commit, state }, payload) {
        commit("CHANGE_CONFIRMATION" /* serverChangeConfirm */, payload);
        commit(determineLocalStateNode(payload, "CHANGE_CONFIRMATION" /* serverChangeConfirm */), payload, {
            root: true
        });
    },
    [FmEvents.RECORD_REMOVED_CONFIRMATION]({ commit, state }, payload) {
        commit("REMOVE_CONFIRMATION" /* serverRemoveConfirm */, payload);
        commit(determineLocalStateNode(payload, "ROLLBACK_CHANGE" /* serverChangeRollback */), payload, {
            root: true
        });
    }
});
