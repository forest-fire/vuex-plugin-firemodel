import { IFmEventActions, IFiremodelState } from "../types";
import { Module } from "vuex";
import { ICompositeKey, Model } from "firemodel";
import { IGenericStateTree } from "..";
export declare function generateLocalId<T = Model>(compositeKey: ICompositeKey<T>, action: IFmEventActions): IFmEventActions;
declare const mutationTypes: string[];
export declare type IFmConfigMutationTypes = keyof typeof mutationTypes;
/**
 * The **Vuex** module that this plugin exports
 */
export declare const FiremodelModule: Module<IFiremodelState, IGenericStateTree>;
export {};