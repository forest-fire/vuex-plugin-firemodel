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

    [FmEvents.WATCHER_STOPPED]({ commit }, payload: IFmWatchEvent) {
      commit(FmConfigMutation.watcherStopped, payload);
      // console.log("Watcher stopped", payload);
    },

    [FmEvents.WATCHER_STOPPED_ALL]({ commit }, payload: IFmWatchEvent) {
      commit(FmConfigMutation.watcherAllStopped, payload);
      // console.log("All watchers stopped", payload);
    },

    /**
     * When getting a SYNC action from a watcher starting, pass this to the
     * appropriate local state node
     */
    async [FmEvents.WATCHER_SYNC]({ commit }, payload: IFmWatchEvent) {
      commit(FmConfigMutation.watcherMuted, payload.watcherId);
      commit(
        determineLocalStateNode(payload, FmCrudMutation.serverStateSync),
        payload,
        { root: true }
      );
      setTimeout(() => {
        commit(FmConfigMutation.watcherUnmuted, payload.watcherId);
      }, 3000);
    }
  } as ActionTree<IFiremodelState<T>, T>);
