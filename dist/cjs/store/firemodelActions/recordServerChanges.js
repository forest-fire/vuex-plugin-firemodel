"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firemodel_1 = require("firemodel");
const determineLocalStateNode_1 = require("../../shared/determineLocalStateNode");
exports.recordServerChanges = {
    [firemodel_1.FmEvents.RECORD_ADDED]({ commit }, payload) {
        commit(determineLocalStateNode_1.determineLocalStateNode(payload, "SERVER_ADD" /* serverAdd */), payload, {
            root: true
        });
    },
    [firemodel_1.FmEvents.RECORD_REMOVED]({ commit }, payload) {
        commit(determineLocalStateNode_1.determineLocalStateNode(payload, "SERVER_REMOVE" /* serverRemove */), payload, {
            root: true
        });
    },
    [firemodel_1.FmEvents.RECORD_CHANGED](store, payload) {
        // Send mutation to appropriate state node
        this.commit(determineLocalStateNode_1.determineLocalStateNode(payload, "SERVER_CHANGE" /* serverChange */), payload, {
            root: true
        });
    }
};
//# sourceMappingURL=recordServerChanges.js.map