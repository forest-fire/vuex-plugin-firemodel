import { FmEvents } from "firemodel";
export const relationship = () => ({
    async [FmEvents.RELATIONSHIP_ADDED_LOCALLY]({ commit, rootState }, payload) {
        // TODO: implement
        console.log("relationship added locally", payload);
    },
    async [FmEvents.RELATIONSHIP_REMOVED_LOCALLY]({ commit, rootState }, payload) {
        // TODO: implement
        console.log("relationship removed locally", payload);
    },
    async [FmEvents.RELATIONSHIP_SET_LOCALLY]({ commit, rootState }, payload) {
        // TODO: implement
        console.log("relationship set locally", payload);
    },
    async [FmEvents.RELATIONSHIP_ADDED_CONFIRMATION]({ commit, rootState }, payload) {
        // TODO: implement
        console.log("relationship add confirmed", payload);
    },
    async [FmEvents.RELATIONSHIP_REMOVED_CONFIRMATION]({ commit, rootState }, payload) {
        // TODO: implement
        console.log("relationship remove confirmed", payload);
    },
    async [FmEvents.RELATIONSHIP_SET_CONFIRMATION]({ commit, rootState }, payload) {
        // TODO: implement
        console.log("relationship set confirmed", payload);
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
