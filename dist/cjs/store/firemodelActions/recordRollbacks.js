"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firemodel_1 = require("firemodel");
const determineLocalStateNode_1 = require("../../shared/determineLocalStateNode");
exports.recordRollbacks = () => ({
    [firemodel_1.FmEvents.RECORD_ADDED_ROLLBACK]({ commit, state }, payload) {
        commit("ROLLBACK_ADD" /* serverAddRollback */, payload);
        commit(determineLocalStateNode_1.determineLocalStateNode(payload, "ROLLBACK_ADD" /* serverAddRollback */), payload, {
            root: true
        });
    },
    [firemodel_1.FmEvents.RECORD_CHANGED_ROLLBACK]({ commit, state }, payload) {
        commit("ROLLBACK_CHANGE" /* serverChangeRollback */, payload);
        commit(determineLocalStateNode_1.determineLocalStateNode(payload, "ROLLBACK_CHANGE" /* serverChangeRollback */), payload, {
            root: true
        });
    },
    [firemodel_1.FmEvents.RECORD_REMOVED_ROLLBACK]({ commit, state }, payload) {
        commit("ROLLBACK_REMOVE" /* serverRemoveRollback */, payload);
        commit(determineLocalStateNode_1.determineLocalStateNode(payload, "ROLLBACK_REMOVE" /* serverRemoveRollback */), payload, {
            root: true
        });
    }
});
//# sourceMappingURL=recordRollbacks.js.map