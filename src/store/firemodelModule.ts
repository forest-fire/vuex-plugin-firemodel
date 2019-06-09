import { IFmEventActions, IFiremodelState } from "../types";
import { Module } from "vuex";
import { ICompositeKey, IFmRecordEvent, Model } from "firemodel";
import { IGenericStateTree } from "..";
import { state } from "./state";
import { mutations } from "./mutations";
import { actionsConfig } from "./actionsConfig";
import { actionsCrud } from "./actionsCrud";

export function generateLocalId<T = Model>(
  compositeKey: ICompositeKey<T>,
  action: IFmEventActions
) {
  // return createCompositeKeyString(compositeKey) + '-' + action
  return action;
}

const mutationTypes = Object.keys(mutations).filter(i => typeof i !== "function");
export type IFmConfigMutationTypes = keyof typeof mutationTypes;

/**
 * The **Vuex** module that this plugin exports
 */
export const FiremodelModule: Module<IFiremodelState, IGenericStateTree> = {
  state,
  mutations,
  ...{ ...actionsConfig, ...actionsCrud },
  namespaced: true
};
