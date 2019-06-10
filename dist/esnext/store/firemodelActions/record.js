import { FmEvents } from "firemodel";
import get from "lodash.get";
import { determineLocalStateNode } from "../../shared/determineLocalStateNode";
export const record = {
    [FmEvents.RECORD_CHANGED_LOCALLY]({ commit, rootState }, payload) {
        const payloadPlus = Object.assign({}, payload, { priorValue: get(rootState, payload.localPath) });
        commit("CHANGED_LOCALLY" /* changedLocally */, payloadPlus);
        commit(`${payload.localPath}/CHANGED_LOCALLY`, payloadPlus, { root: true });
    },
    [FmEvents.RECORD_ADDED_LOCALLY]({ commit, rootState }, payload) {
        const payloadPlus = Object.assign({}, payload, { priorValue: get(rootState, payload.localPath) });
        commit("ADDED_LOCALLY" /* addedLocally */, payloadPlus);
        commit(determineLocalStateNode(payload, "ADDED_LOCALLY" /* addedLocally */), payloadPlus, {
            root: true
        });
    },
    [FmEvents.RECORD_ADDED_CONFIRMATION]({ commit, state }, payload) {
        commit("ADD_CONFIRMATION" /* serverAddConfirm */, payload);
        commit(determineLocalStateNode(payload, "ADD_CONFIRMATION" /* serverAddConfirm */), payload, {
            root: true
        });
    },
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
    /**
     * The record has changed in an unstated way; this
     * type of event should typically come from a "value"
     * based event watcher on a record.
     */
    [FmEvents.RECORD_CHANGED](store, payload) {
        if (payload.watcherSource === "record") {
            console.log(determineLocalStateNode(payload, "CHANGE_CONFIRMATION" /* serverChangeConfirm */));
        }
        // 2nd phase of 2 phase commit
        store.commit("CHANGE_CONFIRMATION" /* serverChangeConfirm */, payload);
        // Send mutation to appropriate state node
        this.commit(determineLocalStateNode(payload, "CHANGE_CONFIRMATION" /* serverChangeConfirm */), payload, {
            root: true
        });
    }
};
