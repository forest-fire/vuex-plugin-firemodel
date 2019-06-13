import { ActionTree } from "vuex";
import { IFiremodelState, IGenericStateTree } from "../..";
import { FmEvents, IFmRecordEvent } from "firemodel";

export const recordRollbacks: ActionTree<IFiremodelState, IGenericStateTree> = {
  [FmEvents.RECORD_ADDED_ROLLBACK]({ commit, state }, payload: IFmRecordEvent) {
    //
  }
};
