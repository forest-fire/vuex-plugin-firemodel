import { FmEvents, IFmWatchEvent, IFmWatcherStopped } from "firemodel";
import { ActionTree } from "vuex";
import { IFiremodelState, FmConfigMutation, FmCrudMutation, determineLocalStateNode } from "../../private";


export const watch = <T>() =>
  ({
    [FmEvents.WATCHER_STARTING]({ commit }, payload: IFmWatchEvent) {
      commit(FmConfigMutation.watcherStarting, payload);
    },

    [FmEvents.WATCHER_STARTED]({ commit }, payload: IFmWatchEvent) {
      commit(FmConfigMutation.watcherStarted, payload);
    },

    [FmEvents.WATCHER_STOPPED]({ commit }, payload: IFmWatcherStopped) {
      commit(FmConfigMutation.watcherStopped, payload);
    },

    [FmEvents.WATCHER_FAILED]({ commit }, payload: IFmWatcherStopped) {
      commit(FmConfigMutation.watcherFailed, payload);
      console.warn(`Watcher ${payload.watcherId} failed to start!`);
    },

    [FmEvents.WATCHER_STOPPED_ALL]({ commit }, payload: IFmWatchEvent) {
      commit(FmConfigMutation.watcherAllStopped, payload);
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
