import { IFiremodelConfig, IVuexState } from "./types";
import type { IAbstractedDatabase, IRealTimeClient, IFirestoreClient } from "universal-fire";
import type { Store } from "vuex";
export declare type IFiremodelVuexModule<T> = {
    "@firemodel": IVuexState<T>;
};
/**
 * **FiremodelPlugin**
 *
 * @param db the database connection (provided by SDK from `universal-fire`)
 * @param config the configuration of the core services this plugin provides
 */
export declare const FiremodelPlugin: <T>(db: IRealTimeClient | IFirestoreClient | IAbstractedDatabase, config: IFiremodelConfig<T & IFiremodelVuexModule<T>>) => (store: Store<T & {
    "@firemodel": IVuexState<T>;
}>) => void;
