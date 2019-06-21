import { MutationTree } from "vuex";
import { IFiremodelState } from "../..";
import { FmCrudMutation } from "../../types/mutations/FmCrudMutation";
import { IFmRecordEvent } from "firemodel";

export const localCrud: MutationTree<IFiremodelState> = {
  [FmCrudMutation.addedLocally](state, payload) {
    type payloadModel = typeof payload.modelConstructor;
    const p: IFmRecordEvent<payloadModel> = payload;
    state.localOnly = state.localOnly.concat({
      action: "add",
      dbPath: p.dbPath,
      localPath: p.localPath,
      value: p.value,
      timestamp: new Date().getTime()
    });
  },

  [FmCrudMutation.changedLocally](state, payload) {
    type payloadModel = typeof payload.modelConstructor;
    const p: IFmRecordEvent<payloadModel> = payload;
    state.localOnly = state.localOnly.concat({
      action: "update",
      dbPath: p.dbPath,
      localPath: p.localPath,
      value: p.value,
      timestamp: new Date().getTime()
    });
  }
};
