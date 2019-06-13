import { ActionTree } from "vuex";
import { IFiremodelState, IGenericStateTree } from "../..";
import { FmEvents, IFmRecordEvent } from "firemodel";
import get from "lodash.get";
import { FmCrudMutation } from "../../types/mutations/FmCrudMutation";
import { determineLocalStateNode } from "../../shared/determineLocalStateNode";

export const recordLocal: ActionTree<IFiremodelState, IGenericStateTree> = {
  [FmEvents.RECORD_CHANGED_LOCALLY]({ commit, rootState }, payload: IFmRecordEvent) {
    const payloadPlus = { ...payload, priorValue: get(rootState, payload.localPath) };
    commit(FmCrudMutation.changedLocally, payloadPlus);
    commit(determineLocalStateNode(payload, FmCrudMutation.changedLocally), payloadPlus, {
      root: true
    });
  },

  [FmEvents.RECORD_ADDED_LOCALLY]({ commit, rootState }, payload: IFmRecordEvent) {
    const payloadPlus = { ...payload, priorValue: get(rootState, payload.localPath) };
    commit(FmCrudMutation.addedLocally, payloadPlus);
    commit(determineLocalStateNode(payload, FmCrudMutation.addedLocally), payloadPlus, {
      root: true
    });
  },

  [FmEvents.RECORD_REMOVED_LOCALLY]({ commit }, payload) {
    commit(FmCrudMutation.removedLocally, payload);
    commit(determineLocalStateNode(payload, FmCrudMutation.removedLocally), payload, {
      root: true
    });
  }
};
