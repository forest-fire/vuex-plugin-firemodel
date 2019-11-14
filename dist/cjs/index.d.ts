import { IFiremodelConfig as IFiremodelPluginConfig, IFiremodelState } from "./types";
import { Store } from "vuex";
import { IFirebaseClientConfig } from "abstracted-client";
import { FirebaseAuth } from "@firebase/auth-types";
export * from "./types";
export * from "./firemodelMutations/index";
export * from "firemodel";
export { database } from "./store";
export * from "./api";
export declare let configuration: IFiremodelPluginConfig<any>;
export declare let dbConfig: IFirebaseClientConfig;
export declare let firemodelVuex: Store<any>;
export declare const setStore: <T>(store: Store<T>) => void;
export declare function getStore<T = any>(): Store<T>;
export declare function getAuth(): Promise<FirebaseAuth>;
export declare function setAuth(auth: FirebaseAuth): void;
export declare type IFiremodel<T> = {
    "@firemodel": IFiremodelState<T>;
};
declare const FirePlugin: <T>(config: IFiremodelPluginConfig<T & IFiremodel<T>>) => (store: Store<T & {
    "@firemodel": IFiremodelState<T>;
}>) => void;
export default FirePlugin;
