import { FmEvents } from "firemodel";
import { determineLocalStateNode } from "../../shared/determineLocalStateNode";
import { get } from "../../shared/index";
export const recordLocal = () => ({
    async [FmEvents.RECORD_CHANGED_LOCALLY]({ commit, rootState }, payload) {
        const payloadPlus = Object.assign(Object.assign({}, payload), { priorValue: get(rootState, payload.localPath) });
        commit("CHANGED_LOCALLY" /* changedLocally */, payloadPlus);
        commit(determineLocalStateNode(payload, "CHANGED_LOCALLY" /* changedLocally */), payloadPlus, {
            root: true
        });
    },
    async [FmEvents.RECORD_ADDED_LOCALLY]({ commit, rootState }, payload) {
        const payloadPlus = Object.assign(Object.assign({}, payload), { priorValue: get(rootState, payload.localPath) });
        commit("ADDED_LOCALLY" /* addedLocally */, payloadPlus);
        commit(determineLocalStateNode(payload, "ADDED_LOCALLY" /* addedLocally */), payloadPlus, {
            root: true
        });
    },
    async [FmEvents.RECORD_REMOVED_LOCALLY]({ commit }, payload) {
        commit("REMOVED_LOCALLY" /* removedLocally */, payload);
        commit(determineLocalStateNode(payload, "REMOVED_LOCALLY" /* removedLocally */), payload, {
            root: true
        });
    }
});
