import { ICompositeKey, Model } from "firemodel";
import { IFmEventActions, IVuexState, actions, mutations, state } from "../private";

import { Module } from "vuex";

export function generateLocalId<T = Model>(
  compositeKey: ICompositeKey<T>,
  action: IFmEventActions
) {
  return action;
}

export { database } from "../state-mgmt/database";

const mutationTypes = Object.keys(mutations).filter(
  i => typeof i !== "function"
);
export type IFmConfigMutationTypes = keyof typeof mutationTypes;

type FunctionToModule = <T>() => Module<IVuexState<T>, T>;

/**
 * The **Vuex** module that this plugin exports
 */
export const FiremodelModule: FunctionToModule = <T>() => ({
  state: state<T>(),
  mutations: mutations<T>(),
  actions: actions<T>(),
  namespaced: true
});