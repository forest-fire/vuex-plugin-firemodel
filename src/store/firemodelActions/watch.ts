import { ActionTree } from "vuex";
import { IFiremodelState } from "../../index";
import { FmEvents, IFmWatchEvent } from "firemodel";
import { FmConfigMutation } from "../../types/mutations/FmConfigMutation";
import { FmCrudMutation } from "../../types";
import { determineLocalStateNode } from "../../shared/determineLocalStateNode";

export const watch = <T>() =>
  ({
    [FmEvents.WATCHER_STARTING]({ commit }, payload: IFmWatchEvent) {
      commit(FmConfigMutation.watcherStarting, payload);
    },

    [FmEvents.WATCHER_STARTED]({ commit }, payload: IFmWatchEvent) {
      commit(FmConfigMutation.watcherStarted, payload);
    },

    /**
     * When getting a SYNC action from a watcher starting, pass this to the
     * appropriate local state node
     */
    [FmEvents.WATCHER_SYNC]({ commit, rootState }, payload: IFmWatchEvent) {
      console.log("watcher sync action", payload);

      commit(
        determineLocalStateNode(payload, FmCrudMutation.serverStateSync),
        payload
      );
    }
  } as ActionTree<IFiremodelState<T>, T>);
