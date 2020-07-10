import { ICompositeKey, Model } from "firemodel";
import { IFmEventActions, IFiremodelState } from "./";
import { Module } from "vuex";
export declare function generateLocalId<T = Model>(compositeKey: ICompositeKey<T>, action: IFmEventActions): IFmEventActions;
declare type FunctionToModule = <T>() => Module<IFiremodelState<T>, T>;
/**
 * The **Vuex** module that this plugin exports
 */
export declare const FiremodelModule: FunctionToModule;
export {};
