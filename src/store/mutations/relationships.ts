import type { IFiremodelState } from '@/types';

import { IFmLocalRelationshipEvent } from 'firemodel';
import { MutationTree } from 'vuex';
import Vue from 'vue';
import { FmCrudMutation } from '@/enums';

export const relationships = <T>() =>
  ({
    // LOCAL
    [FmCrudMutation.relationshipAddedLocally](state, payload: IFmLocalRelationshipEvent<T>) {
      Vue.set(state, 'localOnly', {
        ...state.localOnly,
        [payload.transactionId]: payload,
      });
    },

    [FmCrudMutation.relationshipSetLocally](state, payload: IFmLocalRelationshipEvent<T>) {
      Vue.set(state, 'localOnly', {
        ...state.localOnly,
        [payload.transactionId]: payload,
      });
    },

    [FmCrudMutation.relationshipRemovedLocally](state, payload: IFmLocalRelationshipEvent<T>) {
      Vue.set(state, 'localOnly', {
        ...state.localOnly,
        [payload.transactionId]: payload,
      });
    },

    // CONFIRMATION
    [FmCrudMutation.relationshipAddConfirmation](state, payload: IFmLocalRelationshipEvent<T>) {
      const transactionId = payload.transactionId;
      const localOnly: typeof state.localOnly = { ...{}, ...state.localOnly };
      delete localOnly[transactionId];
      Vue.set(state, 'localOnly', localOnly);
    },
    [FmCrudMutation.relationshipRemovedConfirmation](state, payload: IFmLocalRelationshipEvent<T>) {
      const transactionId = payload.transactionId;
      const localOnly: typeof state.localOnly = { ...{}, ...state.localOnly };
      delete localOnly[transactionId];
      Vue.set(state, 'localOnly', localOnly);
    },
    [FmCrudMutation.relationshipSetConfirmation](state, payload: IFmLocalRelationshipEvent<T>) {
      const transactionId = payload.transactionId;
      const localOnly: typeof state.localOnly = { ...{}, ...state.localOnly };
      delete localOnly[transactionId];
      Vue.set(state, 'localOnly', localOnly);
    },

    // ROLLBACK
    /**
     * Note: this and all rollback mutations remove their
     * entry from the `localOnly` state hash because the
     * action which called this will have ensured that the
     * actual properties that had been set locally were rolled
     * back already
     */
    [FmCrudMutation.relationshipAddRollback](state, payload: IFmLocalRelationshipEvent<T>) {
      delete state.localOnly[payload.transactionId];
    },
    [FmCrudMutation.relationshipRemovedRollback](state, payload: IFmLocalRelationshipEvent<T>) {
      delete state.localOnly[payload.transactionId];
    },
    [FmCrudMutation.relationshipSetRollback](state, payload: IFmLocalRelationshipEvent<T>) {
      delete state.localOnly[payload.transactionId];
    },
  } as MutationTree<IFiremodelState<T>>);
