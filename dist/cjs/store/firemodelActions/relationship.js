"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firemodel_1 = require("firemodel");
exports.relationship = () => ({
    async [firemodel_1.FmEvents.RELATIONSHIP_ADDED_LOCALLY]({ commit, rootState }, payload) {
        commit("RELATIONSHIP_ADDED_LOCALLY" /* relationshipAddedLocally */, payload);
    },
    async [firemodel_1.FmEvents.RELATIONSHIP_REMOVED_LOCALLY]({ commit, rootState }, payload) {
        commit("RELATIONSHIP_REMOVED_LOCALLY" /* relationshipRemovedLocally */, payload);
    },
    async [firemodel_1.FmEvents.RELATIONSHIP_SET_LOCALLY]({ commit, rootState }, payload) {
        commit("RELATIONSHIP_SET_LOCALLY" /* relationshipSetLocally */, payload);
    },
    async [firemodel_1.FmEvents.RELATIONSHIP_ADDED_CONFIRMATION]({ commit, rootState }, payload) {
        commit("RELATIONSHIP_ADDED_CONFIRMATION" /* relationshipAddConfirmation */, payload);
    },
    async [firemodel_1.FmEvents.RELATIONSHIP_REMOVED_CONFIRMATION]({ commit, rootState }, payload) {
        commit("RELATIONSHIP_REMOVED_CONFIRMATION" /* relationshipRemovedConfirmation */, payload);
    },
    async [firemodel_1.FmEvents.RELATIONSHIP_SET_CONFIRMATION]({ commit, rootState }, payload) {
        commit("RELATIONSHIP_SET_CONFIRMATION" /* relationshipSetConfirmation */, payload);
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
});
//# sourceMappingURL=relationship.js.map