import { ICompositeKey, Model } from "firemodel";
import { IFmEventActions, IVuexState } from "../private";
import { Module } from "vuex";
export declare function generateLocalId<T = Model>(compositeKey: ICompositeKey<T>, action: IFmEventActions): IFmEventActions;
export { database } from "../state-mgmt/database";
declare const mutationTypes: string[];
export declare type IFmConfigMutationTypes = keyof typeof mutationTypes;
declare type FunctionToModule = <T>() => Module<IVuexState<T>, T>;
/**
 * The **Vuex** module that this plugin exports
 */
export declare const FiremodelModule: FunctionToModule;
