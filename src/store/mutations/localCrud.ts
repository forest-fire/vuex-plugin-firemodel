import { MutationTree } from "vuex";
import { IFiremodelState } from "../..";
import { FmCrudMutation } from "../../types/mutations/FmCrudMutation";
import { IFmWatchEvent, IFmLocalRecordEvent } from "firemodel";
import { localChange } from "../../shared/localChange";

export const localCrud = <T>() =>
  ({
    [FmCrudMutation.addedLocally](state, payload: IFmLocalRecordEvent<T>) {
      state.localOnly[payload.transactionId] = payload;
    },

    [FmCrudMutation.changedLocally](state, payload: IFmLocalRecordEvent<T>) {
      state.localOnly[payload.transactionId] = payload;
    },

    [FmCrudMutation.removedLocally](state, payload: IFmLocalRecordEvent<T>) {
      state.localOnly[payload.transactionId] = payload;
    }
  } as MutationTree<IFiremodelState<T>>);
