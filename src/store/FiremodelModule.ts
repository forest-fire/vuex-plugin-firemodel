import { ICompositeKey, Model } from 'firemodel';
import type { IFmEventActions, IFiremodelState } from '@/types';
import { actions, mutations, state } from '@/store';
import { Module } from 'vuex';

export function generateLocalId<T = Model>(
  compositeKey: ICompositeKey<T>,
  action: IFmEventActions
) {
  return action;
}
export type FunctionToModule = <T>() => Module<IFiremodelState<T>, T>;

/**
 * The **Vuex** module that this plugin exports
 */
export const FiremodelModule: FunctionToModule = <T>() => ({
  state: state<T>(),
  mutations: mutations<T>(),
  actions: actions<T>(),
  namespaced: true,
});
