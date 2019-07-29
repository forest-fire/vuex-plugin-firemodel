import { ActionTree } from "vuex";
import { IFiremodelState } from "../../index";
import { FmEvents, IFmWatchEvent } from "firemodel";
import { FmConfigMutation } from "../../types/mutations/FmConfigMutation";

export const watch = <T>() =>
  ({
    [FmEvents.WATCHER_STARTING]({ commit }, payload: IFmWatchEvent) {
      commit(FmConfigMutation.watcherStarting, payload);
    },

    [FmEvents.WATCHER_STARTED]({ commit }, payload: IFmWatchEvent) {
      commit(FmConfigMutation.watcherStarted, payload);
    }
  } as ActionTree<IFiremodelState<T>, T>);
