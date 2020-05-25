import { FmEvents, IFmWatchEvent } from "firemodel";

import { ActionTree } from "vuex";
import { FmCrudMutation } from "../../types/mutations/FmCrudMutation";
import { IVuexState } from "../../index";
import { determineLocalStateNode } from "../../shared/determineLocalStateNode";

export const recordConfirms = <T>() =>
  ({
    [FmEvents.RECORD_ADDED_CONFIRMATION](
      { commit, state },
      payload: IFmWatchEvent
    ) {
      commit(FmCrudMutation.serverAddConfirm, payload);
      commit(
        determineLocalStateNode(payload, FmCrudMutation.serverAddConfirm),
        payload,
        {
          root: true
        }
      );
    },

    [FmEvents.RECORD_CHANGED_CONFIRMATION](
      { commit, state },
      payload: IFmWatchEvent
    ) {
      commit(FmCrudMutation.serverChangeConfirm, payload);
      commit(
        determineLocalStateNode(payload, FmCrudMutation.serverChangeConfirm),
        payload,
        {
          root: true
        }
      );
    },

    [FmEvents.RECORD_REMOVED_CONFIRMATION](
      { commit, state },
      payload: IFmWatchEvent
    ) {
      commit(FmCrudMutation.serverRemoveConfirm, payload);
      commit(
        determineLocalStateNode(payload, FmCrudMutation.serverChangeRollback),
        payload,
        {
          root: true
        }
      );
    }
  } as ActionTree<IVuexState<T>, T>);
