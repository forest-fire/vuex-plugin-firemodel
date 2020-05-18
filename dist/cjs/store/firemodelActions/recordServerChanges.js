"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordServerChanges = void 0;
const firemodel_1 = require("firemodel");
const determineLocalStateNode_1 = require("../../shared/determineLocalStateNode");
exports.recordServerChanges = () => ({
    [firemodel_1.FmEvents.RECORD_ADDED]({ commit, state }, payload) {
        if (!state.muted.includes(payload.watcherId)) {
            try {
                commit(determineLocalStateNode_1.determineLocalStateNode(payload, "SERVER_ADD" /* serverAdd */), payload, {
                    root: true
                });
            }
            catch (e) {
                console.error(`Problem with mutation ${determineLocalStateNode_1.determineLocalStateNode(payload, "SERVER_ADD" /* serverAdd */)}. Payload was: ${payload}\n\nError was: ${e.message}`);
            }
        }
    },
    [firemodel_1.FmEvents.RECORD_REMOVED]({ commit }, payload) {
        commit(determineLocalStateNode_1.determineLocalStateNode(payload, "SERVER_REMOVE" /* serverRemove */), payload, {
            root: true
        });
    },
    [firemodel_1.FmEvents.RECORD_MOVED]({ commit }, payload) {
        console.info("A RECORD_MOVED action was received", payload);
    },
    [firemodel_1.FmEvents.RECORD_CHANGED]({ commit }, payload) {
        try {
            commit(determineLocalStateNode_1.determineLocalStateNode(payload, "SERVER_CHANGE" /* serverChange */), payload, {
                root: true
            });
        }
        catch (e) {
            console.error(`Problem with mutation ${determineLocalStateNode_1.determineLocalStateNode(payload, "SERVER_ADD" /* serverAdd */)}. Payload was: ${payload}.\n\nError was: ${e.message}`);
        }
    }
});
//# sourceMappingURL=recordServerChanges.js.map