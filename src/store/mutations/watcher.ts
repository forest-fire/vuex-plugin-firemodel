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
    },

    [FmConfigMutation.watcherMuted](state, watcherId) {
      state.muted = state.muted.concat(watcherId);
    },

    [FmConfigMutation.watcherUnmuted](state, watcherId) {
      state.muted = state.muted.filter(i => i !== watcherId);
    }
  } as MutationTree<IFiremodelState<T>>);
