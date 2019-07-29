import { MutationTree } from "vuex";
import { IFiremodelState } from "../..";
import { FmConfigMutation } from "../../types/mutations/FmConfigMutation";

export const watcher = <T>() =>
  ({
    [FmConfigMutation.watcherStarting](state, payload) {
      //
    },

    [FmConfigMutation.watcherStarted](state, payload) {
      state.watching = state.watching.concat(payload);
    }
  } as MutationTree<IFiremodelState<T>>);
