import { IFiremodelState } from "../../index";
import { IFmWatcherStopped, IWatcherEventContext } from "firemodel";
import { FmConfigMutation } from "../../types/mutations/FmConfigMutation";
import { MutationTree } from "vuex";

export const watcher = <T>() =>
  ({
    [FmConfigMutation.watcherStarting](
      state: IFiremodelState<T>,
      payload: IWatcherEventContext
    ) {
      //
    },

    [FmConfigMutation.watcherStarted](
      state: IFiremodelState<T>,
      payload: IWatcherEventContext
    ) {
      state.watching = state.watching.concat(payload);
    },

    [FmConfigMutation.watcherStopped](
      state: IFiremodelState<T>,
      payload: IFmWatcherStopped
    ) {
      state.watching = state.watching.filter(
        i => i.watcherId !== payload.watcherId
      );
    },
    [FmConfigMutation.watcherAllStopped](state: IFiremodelState<T>, payload) {
      state.watching = [];
    },

    [FmConfigMutation.watcherMuted](
      state: IFiremodelState<T>,
      watcherId: string
    ) {
      state.muted = state.muted.concat(watcherId);
    },

    [FmConfigMutation.watcherUnmuted](
      state: IFiremodelState<T>,
      watcherId: string
    ) {
      state.muted = state.muted.filter(i => i !== watcherId);
    }
  } as MutationTree<IFiremodelState<T>>);
