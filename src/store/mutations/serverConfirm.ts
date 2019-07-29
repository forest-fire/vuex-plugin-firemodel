import { MutationTree } from "vuex";
import { IFiremodelState, IFmLocalRecordEvent } from "../../index";
import { FmCrudMutation } from "../../types/mutations/FmCrudMutation";

export const serverConfirm = <T>() =>
  ({
    [FmCrudMutation.serverAddConfirm](state, payload: IFmLocalRecordEvent<T>) {
      delete state.localOnly[payload.transactionId];
    },

    [FmCrudMutation.serverChangeConfirm](
      state,
      payload: IFmLocalRecordEvent<T>
    ) {
      delete state.localOnly[payload.transactionId];
    },

    [FmCrudMutation.serverRemoveConfirm](
      state,
      payload: IFmLocalRecordEvent<T>
    ) {
      delete state.localOnly[payload.transactionId];
    }
  } as MutationTree<IFiremodelState<T>>);
