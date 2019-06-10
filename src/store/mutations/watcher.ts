import { MutationTree } from "vuex";
import { IFiremodelState } from "../..";
import { FmConfigMutation } from "../../types/mutations/FmConfigMutation";

export const watcher: MutationTree<IFiremodelState> = {
  [FmConfigMutation.watcherStarting](state, payload) {
    //
  },

  [FmConfigMutation.watcherStarted](state, payload) {
    state.watching = state.watching.concat(payload);
  }
};
