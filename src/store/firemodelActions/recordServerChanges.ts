import { ActionTree } from "vuex";
import { IFiremodelState } from "../../index";
import { FmEvents, IFmWatchEvent } from "firemodel";
import { FmCrudMutation } from "../../types/mutations/FmCrudMutation";
import { determineLocalStateNode } from "../../shared/determineLocalStateNode";

export const recordServerChanges = <T>() =>
  ({
    [FmEvents.RECORD_ADDED]({ commit, state }, payload: IFmWatchEvent) {
      if (!state.muted.includes(payload.watcherId)) {
        try {
          commit(
            determineLocalStateNode(payload, FmCrudMutation.serverAdd),
            payload,
            {
              root: true
            }
          );
        } catch (e) {
          console.error(
            `Problem with mutation ${determineLocalStateNode(
              payload,
              FmCrudMutation.serverAdd
            )}. Payload was: ${payload}\n\nError was: ${e.message}`
          );
        }
      }
    },

    [FmEvents.RECORD_REMOVED]({ commit }, payload) {
      commit(
        determineLocalStateNode(payload, FmCrudMutation.serverRemove),
        payload,
        {
          root: true
        }
      );
    },

    [FmEvents.RECORD_MOVED]({ commit }, payload) {
      console.info("A RECORD_MOVED action was received", payload);
    },

    [FmEvents.RECORD_CHANGED]({ commit }, payload: IFmWatchEvent) {
      try {
        commit(
          determineLocalStateNode(payload, FmCrudMutation.serverChange),
          payload,
          {
            root: true
          }
        );
      } catch (e) {
        console.error(
          `Problem with mutation ${determineLocalStateNode(
            payload,
            FmCrudMutation.serverAdd
          )}. Payload was: ${payload}.\n\nError was: ${e.message}`
        );
      }
    }
  } as ActionTree<IFiremodelState<T>, T>);
