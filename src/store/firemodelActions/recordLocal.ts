import type {  IFiremodelState } from "@/types";
import { FmEvents, IFmWatchEvent } from "firemodel";
import { determineLocalStateNode } from "@/util";
import { ActionTree } from "vuex";
import { get } from "native-dash";
import { FmCrudMutation } from "@/enums";

export const recordLocal = <T>() =>
  ({
    async [FmEvents.RECORD_CHANGED_LOCALLY](
      { commit, rootState },
      payload: IFmWatchEvent
    ) {
      const payloadPlus = {
        ...payload,
        priorValue: get(rootState, payload.localPath)
      };
      commit(FmCrudMutation.changedLocally, payloadPlus);
      commit(
        determineLocalStateNode(payload, FmCrudMutation.changedLocally),
        payloadPlus,
        {
          root: true
        }
      );
    },

    async [FmEvents.RECORD_ADDED_LOCALLY](
      { commit, rootState },
      payload: IFmWatchEvent
    ) {
      const payloadPlus = {
        ...payload,
        priorValue: get(rootState, payload.localPath)
      };
      commit(FmCrudMutation.addedLocally, payloadPlus);
      commit(
        determineLocalStateNode(payload, FmCrudMutation.addedLocally),
        payloadPlus,
        {
          root: true
        }
      );
    },

    async [FmEvents.RECORD_REMOVED_LOCALLY]({ commit }, payload) {
      commit(FmCrudMutation.removedLocally, payload);
      commit(
        determineLocalStateNode(payload, FmCrudMutation.removedLocally),
        payload,
        {
          root: true
        }
      );
    }
  } as ActionTree<IFiremodelState<T>, T>);
