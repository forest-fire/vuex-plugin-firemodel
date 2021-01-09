import { FmCrudMutation } from "@/enums";
import type {  IFiremodelState } from "@/types";
import { FmEvents, IFmLocalRelationshipEvent } from "firemodel";

import { ActionTree } from "vuex";

export const relationship = <T>() =>
  ({
    async [FmEvents.RELATIONSHIP_ADDED_LOCALLY](
      { commit, rootState },
      payload: IFmLocalRelationshipEvent
    ) {
      commit(FmCrudMutation.relationshipAddedLocally, payload);
    },
    async [FmEvents.RELATIONSHIP_REMOVED_LOCALLY](
      { commit, rootState },
      payload: IFmLocalRelationshipEvent
    ) {
      commit(FmCrudMutation.relationshipRemovedLocally, payload);
    },
    async [FmEvents.RELATIONSHIP_SET_LOCALLY](
      { commit, rootState },
      payload: IFmLocalRelationshipEvent 
    ) {
      commit(FmCrudMutation.relationshipSetLocally, payload);
    },

    async [FmEvents.RELATIONSHIP_ADDED_CONFIRMATION](
      { commit, rootState },
      payload: IFmLocalRelationshipEvent
    ) {
      commit(FmCrudMutation.relationshipAddConfirmation, payload);
    },
    async [FmEvents.RELATIONSHIP_REMOVED_CONFIRMATION](
      { commit, rootState },
      payload: IFmLocalRelationshipEvent
    ) {
      commit(FmCrudMutation.relationshipRemovedConfirmation, payload);
    },
    async [FmEvents.RELATIONSHIP_SET_CONFIRMATION](
      { commit, rootState },
      payload: IFmLocalRelationshipEvent
    ) {
      commit(FmCrudMutation.relationshipSetConfirmation, payload);
    },

    async [FmEvents.RELATIONSHIP_ADDED_ROLLBACK](
      { commit, rootState },
      payload: IFmLocalRelationshipEvent
    ) {
      // TODO: implement
      console.log("relationship add rolled back", payload);
    },
    async [FmEvents.RELATIONSHIP_REMOVED_ROLLBACK](
      { commit, rootState },
      payload: IFmLocalRelationshipEvent
    ) {
      // TODO: implement
      console.log("relationship remove rolled back", payload);
    },
    async [FmEvents.RELATIONSHIP_SET_ROLLBACK](
      { commit, rootState },
      payload: IFmLocalRelationshipEvent
    ) {
      // TODO: implement
      console.log("relationship set rolled back", payload);
    }
  } as ActionTree<IFiremodelState<T>, T>);
