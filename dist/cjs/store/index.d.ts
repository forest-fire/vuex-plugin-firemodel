import { IFmEventActions, IFiremodelState } from "../types";
import { Module } from "vuex";
import { ICompositeKey, Model } from "firemodel";
export declare function generateLocalId<T = Model>(compositeKey: ICompositeKey<T>, action: IFmEventActions): IFmEventActions;
export { database } from "../shared/database";
declare const mutationTypes: string[];
export declare type IFmConfigMutationTypes = keyof typeof mutationTypes;
declare type FunctionToModule = <T>() => Module<IFiremodelState<T>, T>;
/**
 * The **Vuex** module that this plugin exports
 */
export declare const FiremodelModule: FunctionToModule;
