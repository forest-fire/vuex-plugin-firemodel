import { MutationTree } from "vuex";
import { IFiremodelState } from "../../index";
import { FmCrudMutation } from "../../types/mutations/FmCrudMutation";
import { IFmLocalRelationshipEvent } from "firemodel";

export const serverConfirm = <T>() =>
  ({
    // LOCAL
    [FmCrudMutation.relationshipAddedLocally](
      state,
      payload: IFmLocalRelationshipEvent<T>
    ) {
      state.localOnly[payload.transactionId] = payload;
    },
    [FmCrudMutation.relationshipRemovedLocally](
      state,
      payload: IFmLocalRelationshipEvent<T>
    ) {
      state.localOnly[payload.transactionId] = payload;
    },
    [FmCrudMutation.relationshipSetLocally](
      state,
      payload: IFmLocalRelationshipEvent<T>
    ) {
      state.localOnly[payload.transactionId] = payload;
    },

    // CONFIRMATION
    [FmCrudMutation.relationshipAddConfirmation](
      state,
      payload: IFmLocalRelationshipEvent<T>
    ) {
      delete state.localOnly[payload.transactionId];
    },
    [FmCrudMutation.relationshipRemovedConfirmation](
      state,
      payload: IFmLocalRelationshipEvent<T>
    ) {
      delete state.localOnly[payload.transactionId];
    },
    [FmCrudMutation.relationshipSetConfirmation](
      state,
      payload: IFmLocalRelationshipEvent<T>
    ) {
      delete state.localOnly[payload.transactionId];
    },

    // ROLLBACK
    /**
     * Note: this and all rollback mutations remove their
     * entry from the `localOnly` state hash because the
     * action which called this will have ensured that the
     * actual properties that had been set locally were rolled
     * back already
     */
    [FmCrudMutation.relationshipAddRollback](
      state,
      payload: IFmLocalRelationshipEvent<T>
    ) {
      delete state.localOnly[payload.transactionId];
    },
    [FmCrudMutation.relationshipRemovedRollback](
      state,
      payload: IFmLocalRelationshipEvent<T>
    ) {
      delete state.localOnly[payload.transactionId];
    },
    [FmCrudMutation.relationshipSetRollback](
      state,
      payload: IFmLocalRelationshipEvent<T>
    ) {
      delete state.localOnly[payload.transactionId];
    }
  } as MutationTree<IFiremodelState<T>>);
