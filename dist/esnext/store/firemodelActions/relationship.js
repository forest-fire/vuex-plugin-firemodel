import { FmEvents } from "firemodel";
export const relationship = () => ({
    async [FmEvents.RELATIONSHIP_ADDED_LOCALLY]({ commit, rootState }, payload) {
        commit("RELATIONSHIP_ADDED_LOCALLY" /* relationshipAddedLocally */, payload);
    },
    async [FmEvents.RELATIONSHIP_REMOVED_LOCALLY]({ commit, rootState }, payload) {
        commit("RELATIONSHIP_REMOVED_LOCALLY" /* relationshipRemovedLocally */, payload);
    },
    async [FmEvents.RELATIONSHIP_SET_LOCALLY]({ commit, rootState }, payload) {
        commit("RELATIONSHIP_SET_LOCALLY" /* relationshipSetLocally */, payload);
    },
    async [FmEvents.RELATIONSHIP_ADDED_CONFIRMATION]({ commit, rootState }, payload) {
        commit("RELATIONSHIP_ADDED_CONFIRMATION" /* relationshipAddConfirmation */, payload);
    },
    async [FmEvents.RELATIONSHIP_REMOVED_CONFIRMATION]({ commit, rootState }, payload) {
        commit("RELATIONSHIP_REMOVED_CONFIRMATION" /* relationshipRemovedConfirmation */, payload);
    },
    async [FmEvents.RELATIONSHIP_SET_CONFIRMATION]({ commit, rootState }, payload) {
        commit("RELATIONSHIP_SET_CONFIRMATION" /* relationshipSetConfirmation */, payload);
    },
    async [FmEvents.RELATIONSHIP_ADDED_ROLLBACK]({ commit, rootState }, payload) {
        // TODO: implement
        console.log("relationship add rolled back", payload);
    },
    async [FmEvents.RELATIONSHIP_REMOVED_ROLLBACK]({ commit, rootState }, payload) {
        // TODO: implement
        console.log("relationship remove rolled back", payload);
    },
    async [FmEvents.RELATIONSHIP_SET_ROLLBACK]({ commit, rootState }, payload) {
        // TODO: implement
        console.log("relationship set rolled back", payload);
    }
});
