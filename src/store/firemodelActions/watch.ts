import { ActionTree } from "vuex";
import { IFiremodelState, IGenericStateTree } from "../..";
import { FmEvents, IFmWatchEvent } from "firemodel";
import { FmConfigAction } from "../../types/actions";
import { FmConfigMutation } from "../../types/mutations/FmConfigMutation";

export const watch: ActionTree<IFiremodelState, IGenericStateTree> = {
  [FmEvents.WATCHER_STARTING]({ commit }, payload: IFmWatchEvent) {
    commit(FmConfigMutation.watcherStarting, payload);
  },

  [FmEvents.WATCHER_STARTED]({ commit }, payload: IFmWatchEvent) {
    commit(FmConfigMutation.watcherStarted, payload);
  }
};
