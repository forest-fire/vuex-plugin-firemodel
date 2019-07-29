"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firemodel_1 = require("firemodel");
exports.relationship = {
    async [firemodel_1.FmEvents.RELATIONSHIP_ADDED_LOCALLY]({ commit, rootState }, payload) {
        // TODO: implement
        console.log("relationship added locally", payload);
    },
    async [firemodel_1.FmEvents.RELATIONSHIP_REMOVED_LOCALLY]({ commit, rootState }, payload) {
        // TODO: implement
        console.log("relationship removed locally", payload);
    },
    async [firemodel_1.FmEvents.RELATIONSHIP_SET_LOCALLY]({ commit, rootState }, payload) {
        // TODO: implement
        console.log("relationship set locally", payload);
    },
    async [firemodel_1.FmEvents.RELATIONSHIP_ADDED_CONFIRMATION]({ commit, rootState }, payload) {
        // TODO: implement
        console.log("relationship add confirmed", payload);
    },
    async [firemodel_1.FmEvents.RELATIONSHIP_REMOVED_CONFIRMATION]({ commit, rootState }, payload) {
        // TODO: implement
        console.log("relationship remove confirmed", payload);
    },
    async [firemodel_1.FmEvents.RELATIONSHIP_SET_CONFIRMATION]({ commit, rootState }, payload) {
        // TODO: implement
        console.log("relationship set confirmed", payload);
    },
    async [firemodel_1.FmEvents.RELATIONSHIP_ADDED_ROLLBACK]({ commit, rootState }, payload) {
        // TODO: implement
        console.log("relationship add rolled back", payload);
    },
    async [firemodel_1.FmEvents.RELATIONSHIP_REMOVED_ROLLBACK]({ commit, rootState }, payload) {
        // TODO: implement
        console.log("relationship remove rolled back", payload);
    },
    async [firemodel_1.FmEvents.RELATIONSHIP_SET_ROLLBACK]({ commit, rootState }, payload) {
        // TODO: implement
        console.log("relationship set rolled back", payload);
    }
};
//# sourceMappingURL=relationship.js.map