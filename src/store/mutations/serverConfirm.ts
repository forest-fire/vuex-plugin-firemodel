import { MutationTree } from "vuex";
import { IFiremodelState, IFmLocalRecordEvent } from "../../index";
import Vue from "vue";
import { FmCrudMutation } from "../../types/mutations/FmCrudMutation";

export const serverConfirm = <T>() =>
  ({
    /**
     * When a change has been made
     */
    [FmCrudMutation.serverAddConfirm](state, payload: IFmLocalRecordEvent<T>) {
      delete state.localOnly[payload.transactionId];
    },

    [FmCrudMutation.serverChangeConfirm](
      state,
      payload: IFmLocalRecordEvent<T>
    ) {
      const transactionId = payload.transactionId;
      const localOnly: typeof state.localOnly = { ...{}, ...state.localOnly };
      delete localOnly[transactionId];

      Vue.set(state, "localOnly", localOnly);
      // delete state.localOnly[payload.transactionId];
    },

    /**
     * Removes the `localOnly` reference to a transaction once the server
     * has confirmed it.
     */
    [FmCrudMutation.serverRemoveConfirm](
      state,
      payload: IFmLocalRecordEvent<T>
    ) {
      const transactionId = payload.transactionId;
      const localOnly: typeof state.localOnly = { ...{}, ...state.localOnly };
      delete localOnly[transactionId];

      Vue.set(state, "localOnly", localOnly);
    },

    [FmCrudMutation.relationshipAddRollback](
      state,
      payload: IFmLocalRecordEvent<T>
    ) {
      const transactionId = payload.transactionId;
      const localOnly: typeof state.localOnly = { ...{}, ...state.localOnly };
      delete localOnly[transactionId];
      Vue.set(state, "localOnly", localOnly);
      console.info(
        `Rolled back changes made locally [ transaction id: ${transactionId} ]`
      );
    }
  } as MutationTree<IFiremodelState<T>>);
