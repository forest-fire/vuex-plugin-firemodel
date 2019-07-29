import { MutationTree } from "vuex";
import { IFiremodelState } from "../..";
import { FmCrudMutation } from "../../types/mutations/FmCrudMutation";

export const serverConfirm = <T>() =>
  ({
    [FmCrudMutation.serverAddConfirm](state, payload) {
      state.localOnly = state.localOnly.filter(
        i => i.dbPath !== payload.dbPath
      );
    },

    [FmCrudMutation.serverChangeConfirm](state, payload) {
      state.localOnly = state.localOnly.filter(
        i => i.dbPath !== payload.dbPath
      );
    },

    [FmCrudMutation.serverRemoveConfirm](state, payload) {
      state.localOnly = state.localOnly.filter(
        i => i.dbPath !== payload.dbPath
      );
    }
  } as MutationTree<IFiremodelState<T>>);
