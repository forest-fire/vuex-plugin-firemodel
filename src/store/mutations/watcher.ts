import { FmConfigMutation, IVuexState } from "@/types";
import { IFmWatcherStopped, IWatcherEventContext } from "firemodel";

import { MutationTree } from "vuex";
import Vue from "vue";

export const watcher = <T>() =>
  ({
    [FmConfigMutation.watcherStarting](
      state: IVuexState<T>,
      payload: IWatcherEventContext
    ) {
      // nothing to do
    },

    [FmConfigMutation.watcherStarted](
      state: IVuexState<T>,
      payload: IWatcherEventContext
    ) {
      Vue.set(
        state,
        "watching",
        state.watching ? state.watching.concat(payload) : [payload]
      );
    },

    [FmConfigMutation.watcherStopped](
      state: IVuexState<T>,
      payload: IFmWatcherStopped
    ) {
      state.watching = state.watching.filter(
        i => i.watcherId !== payload.watcherId
      );
    },
    [FmConfigMutation.watcherAllStopped](state: IVuexState<T>, payload) {
      state.watching = [];
    },

    [FmConfigMutation.watcherMuted](
      state: IVuexState<T>,
      watcherId: string
    ) {
      state.muted = state.muted.concat(watcherId);
    },

    [FmConfigMutation.watcherUnmuted](
      state: IVuexState<T>,
      watcherId: string
    ) {
      state.muted = state.muted.filter(i => i !== watcherId);
    }
  } as MutationTree<IVuexState<T>>);
