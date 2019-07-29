import { MutationTree } from "vuex";
import { IFiremodelState } from "../..";
import { FmCrudMutation } from "../../types/mutations/FmCrudMutation";
import { IFmWatchEvent } from "firemodel";
import { localChange } from "../../shared/localChange";

export const localCrud = <T>() =>
  ({
    [FmCrudMutation.addedLocally](state, payload) {
      type payloadModel = typeof payload.modelConstructor;
      const p: IFmWatchEvent<payloadModel> = payload;
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
      const p: IFmWatchEvent<payloadModel> = payload;
      state.localOnly = state.localOnly.concat({
        action: "update",
        dbPath: p.dbPath,
        localPath: p.localPath,
        value: p.value,
        timestamp: new Date().getTime()
      });
    },

    [FmCrudMutation.removedLocally](state, payload: IFmWatchEvent) {
      state.localOnly = state.localOnly.concat(localChange(payload));
    }
  } as MutationTree<IFiremodelState<T>>);
