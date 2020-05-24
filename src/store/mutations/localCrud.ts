import { FmCrudMutation, IVuexState } from "../../private";

import { IFmLocalRecordEvent } from "firemodel";
import { MutationTree } from "vuex";
import Vue from "vue";

export const localCrud = <T>() =>
  ({
    [FmCrudMutation.addedLocally](state, payload: IFmLocalRecordEvent<T>) {
      Vue.set(state, "localOnly", {
        ...state.localOnly,
        [payload.transactionId]: payload
      });
    },

    [FmCrudMutation.changedLocally](state, payload: IFmLocalRecordEvent<T>) {
      Vue.set(state, "localOnly", {
        ...state.localOnly,
        [payload.transactionId]: payload
      });
    },

    [FmCrudMutation.removedLocally](state, payload: IFmLocalRecordEvent<T>) {
      const localOnly: typeof state.localOnly = { ...{}, ...state.localOnly };
      delete localOnly[payload.transactionId];

      Vue.set(state, "localOnly", localOnly);
    }
  } as MutationTree<IVuexState<T>>);
