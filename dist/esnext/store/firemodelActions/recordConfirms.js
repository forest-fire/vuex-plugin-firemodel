import { FmEvents } from "firemodel";
import { determineLocalStateNode } from "../../shared/determineLocalStateNode";
export const recordConfirms = {
    [FmEvents.RECORD_ADDED_CONFIRMATION]({ commit, state }, payload) {
        commit("ADD_CONFIRMATION" /* serverAddConfirm */, payload);
        commit(determineLocalStateNode(payload, "ADD_CONFIRMATION" /* serverAddConfirm */), payload, {
            root: true
        });
    }
};
