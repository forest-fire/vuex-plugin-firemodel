import { IFiremodelConfig, IFiremodelState } from "./private";
import { IAbstractedDatabase } from "universal-fire";
import type { Store } from "vuex";
export declare type IFiremodel<T> = {
    "@firemodel": IFiremodelState<T>;
};
/**
 * **FiremodelPlugin**
 *
 * @param db the database connection (provided by SDK from `universal-fire`)
 * @param config the configuration of the core services this plugin provides
 */
export declare const FiremodelPlugin: <T>(db: IAbstractedDatabase, config: IFiremodelConfig<T & IFiremodel<T>>) => (store: Store<T & {
    "@firemodel": IFiremodelState<T>;
}>) => void;
