import { ActionTree } from "vuex";
import { IFiremodelState, IGenericStateTree } from "../..";
import { FmEvents, IFmRecordEvent, IFMRecordEvent, Model, pathJoin } from "firemodel";
import get from "lodash.get";
import { FmCrudMutation } from "../../types/mutations/FmCrudMutation";
import { generateLocalId } from "..";
import { determineLocalStateNode } from "../../shared/determineLocalStateNode";

export const recordServerChanges: ActionTree<IFiremodelState, IGenericStateTree> = {
  [FmEvents.RECORD_ADDED]({ commit }, payload: IFmRecordEvent) {
    commit(determineLocalStateNode(payload, FmCrudMutation.serverAdd), payload, {
      root: true
    });
  },

  [FmEvents.RECORD_REMOVED]({ commit }, payload) {
    commit(determineLocalStateNode(payload, FmCrudMutation.serverRemove), payload, {
      root: true
    });
  },

  [FmEvents.RECORD_CHANGED](store, payload: IFmRecordEvent) {
    // Send mutation to appropriate state node
    this.commit(determineLocalStateNode(payload, FmCrudMutation.serverChange), payload, {
      root: true
    });
  }
};
