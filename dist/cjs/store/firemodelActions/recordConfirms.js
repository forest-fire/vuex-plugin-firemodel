"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordConfirms = void 0;
const firemodel_1 = require("firemodel");
const determineLocalStateNode_1 = require("../../shared/determineLocalStateNode");
exports.recordConfirms = () => ({
    [firemodel_1.FmEvents.RECORD_ADDED_CONFIRMATION]({ commit, state }, payload) {
        commit("ADD_CONFIRMATION" /* serverAddConfirm */, payload);
        commit(determineLocalStateNode_1.determineLocalStateNode(payload, "ADD_CONFIRMATION" /* serverAddConfirm */), payload, {
            root: true
        });
    },
    [firemodel_1.FmEvents.RECORD_CHANGED_CONFIRMATION]({ commit, state }, payload) {
        commit("CHANGE_CONFIRMATION" /* serverChangeConfirm */, payload);
        commit(determineLocalStateNode_1.determineLocalStateNode(payload, "CHANGE_CONFIRMATION" /* serverChangeConfirm */), payload, {
            root: true
        });
    },
    [firemodel_1.FmEvents.RECORD_REMOVED_CONFIRMATION]({ commit, state }, payload) {
        commit("REMOVE_CONFIRMATION" /* serverRemoveConfirm */, payload);
        commit(determineLocalStateNode_1.determineLocalStateNode(payload, "ROLLBACK_CHANGE" /* serverChangeRollback */), payload, {
            root: true
        });
    }
});
//# sourceMappingURL=recordConfirms.js.map