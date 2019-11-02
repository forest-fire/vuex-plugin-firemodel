import { MutationTree } from "vuex";
import { IFiremodelState, IFmLocalRecordEvent } from "../../index";
import Vue from "vue";
import { FmCrudMutation } from "../../types/mutations/FmCrudMutation";

export const serverRollback = <T>() =>
  ({
    /**
     * Local ADD must be rolled back
     */
    [FmCrudMutation.serverAddRollback](state, payload: IFmLocalRecordEvent<T>) {
      // TODO: implement
    },

    [FmCrudMutation.serverChangeRollback](
      state,
      payload: IFmLocalRecordEvent<T>
    ) {
      // TODO: implement
    },

    /**
     * Removes the `localOnly` reference to a transaction once the server
     * has confirmed it.
     */
    [FmCrudMutation.serverRemoveRollback](
      state,
      payload: IFmLocalRecordEvent<T>
    ) {
      // TODO: implement
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
