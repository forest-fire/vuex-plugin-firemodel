"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordLocal = void 0;
const firemodel_1 = require("firemodel");
const determineLocalStateNode_1 = require("../../shared/determineLocalStateNode");
const index_1 = require("../../shared/index");
exports.recordLocal = () => ({
    async [firemodel_1.FmEvents.RECORD_CHANGED_LOCALLY]({ commit, rootState }, payload) {
        const payloadPlus = Object.assign(Object.assign({}, payload), { priorValue: index_1.get(rootState, payload.localPath) });
        commit("CHANGED_LOCALLY" /* changedLocally */, payloadPlus);
        commit(determineLocalStateNode_1.determineLocalStateNode(payload, "CHANGED_LOCALLY" /* changedLocally */), payloadPlus, {
            root: true
        });
    },
    async [firemodel_1.FmEvents.RECORD_ADDED_LOCALLY]({ commit, rootState }, payload) {
        const payloadPlus = Object.assign(Object.assign({}, payload), { priorValue: index_1.get(rootState, payload.localPath) });
        commit("ADDED_LOCALLY" /* addedLocally */, payloadPlus);
        commit(determineLocalStateNode_1.determineLocalStateNode(payload, "ADDED_LOCALLY" /* addedLocally */), payloadPlus, {
            root: true
        });
    },
    async [firemodel_1.FmEvents.RECORD_REMOVED_LOCALLY]({ commit }, payload) {
        commit("REMOVED_LOCALLY" /* removedLocally */, payload);
        commit(determineLocalStateNode_1.determineLocalStateNode(payload, "REMOVED_LOCALLY" /* removedLocally */), payload, {
            root: true
        });
    }
});
//# sourceMappingURL=recordLocal.js.map