import { ActionTree } from "vuex";
import { IFiremodelState, IGenericStateTree } from "../..";
import { FmEvents, IFmRecordEvent } from "firemodel";
import { FmCrudMutation } from "../../types/mutations/FmCrudMutation";
import { determineLocalStateNode } from "../../shared/determineLocalStateNode";

export const recordConfirms: ActionTree<IFiremodelState, IGenericStateTree> = {
  [FmEvents.RECORD_ADDED_CONFIRMATION]({ commit, state }, payload: IFmRecordEvent) {
    commit(FmCrudMutation.serverAddConfirm, payload);
    commit(determineLocalStateNode(payload, FmCrudMutation.serverAddConfirm), payload, {
      root: true
    });
  }
};
