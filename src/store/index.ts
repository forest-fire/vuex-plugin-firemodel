import { IFmEventActions, IFiremodelState } from "../types";
import { Module } from "vuex";
import { ICompositeKey, Model } from "firemodel";
import { IGenericStateTree } from "..";
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

/**
 * The **Vuex** module that this plugin exports
 */
export const FiremodelModule: Module<IFiremodelState, IGenericStateTree> = {
  state,
  mutations,
  actions,
  namespaced: true
};
