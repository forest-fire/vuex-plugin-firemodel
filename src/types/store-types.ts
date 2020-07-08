import { ICompositeKey, Model } from "firemodel";
import { IFmEventActions, IFiremodelState } from "@/types";
import { actions, mutations, state } from "@/store";

import { Module } from "vuex";

export function generateLocalId<T = Model>(
  compositeKey: ICompositeKey<T>,
  action: IFmEventActions
) {
  return action;
}

// const mutationTypes = Object.keys(mutations).filter(
//   i => typeof i !== "function"
// );
// export type IFmConfigMutationTypes = keyof typeof mutationTypes;

type FunctionToModule = <T>() => Module<IFiremodelState<T>, T>;

/**
 * The **Vuex** module that this plugin exports
 */
export const FiremodelModule: FunctionToModule = <T>() => ({
  state: state<T>(),
  mutations: mutations<T>(),
  actions: actions<T>(),
  namespaced: true
});
