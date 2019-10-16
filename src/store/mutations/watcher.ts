import { MutationTree } from "vuex";
import { IFiremodelState } from "../..";
import { FmConfigMutation } from "../../types/mutations/FmConfigMutation";
import { FmCrudMutation } from "../../types";

export const watcher = <T>() =>
  ({
    [FmConfigMutation.watcherStarting](state, payload) {
      //
    },

    [FmConfigMutation.watcherStarted](state, payload) {
      state.watching = state.watching.concat(payload);
    },

    [FmCrudMutation.serverStateSync](state, payload) {
      console.log("server state sync: ", payload);
    }
  } as MutationTree<IFiremodelState<T>>);
