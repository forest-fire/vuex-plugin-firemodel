import { IFiremodelConfig as IFiremodelPluginConfig, IFiremodelState } from "./types";
import { Store } from "vuex";
import { DB, FirebaseAuth, IFirebaseClientConfig } from "abstracted-client";
export * from "./types";
export * from "./firemodelMutations/index";
export * from "firemodel";
export declare let configuration: IFiremodelPluginConfig<any>;
export declare let dbConfig: IFirebaseClientConfig;
export declare let firemodelVuex: Store<any>;
export declare const setStore: <T>(store: Store<T>) => void;
export declare function getDb(config?: IFirebaseClientConfig): Promise<DB>;
export declare function setDb(db: DB): void;
export declare function getAuth(): Promise<import("@firebase/auth-types").FirebaseAuth>;
export declare function setAuth(auth: FirebaseAuth): void;
export declare type IFiremodel<T> = {
    "@firemodel": IFiremodelState<T>;
};
declare const FirePlugin: <T>(config: IFiremodelPluginConfig<T & IFiremodel<T>>) => (store: Store<T & {
    "@firemodel": IFiremodelState<T>;
}>) => void;
export default FirePlugin;
