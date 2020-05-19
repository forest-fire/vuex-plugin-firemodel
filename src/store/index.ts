import { ICompositeKey, Model } from "firemodel";
import { Module } from "vuex";
import { IFmEventActions, IFiremodelState } from "../private";
import { state } from "./state";
import { mutations } from "./mutations/index";
import { actions } from "./actions";

export function generateLocalId<T = Model>(
  compositeKey: ICompositeKey<T>,
  action: IFmEventActions
) {
  return action;
}

export { database } from "../shared/database";

const mutationTypes = Object.keys(mutations).filter(
  i => typeof i !== "function"
);
export type IFmConfigMutationTypes = keyof typeof mutationTypes;

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
