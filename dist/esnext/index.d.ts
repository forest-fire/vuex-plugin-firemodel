import { IFiremodelConfig as IFiremodelPluginConfig, IFiremodelState } from "./types";
import { Store } from "vuex";
import { DB, FirebaseAuth, IFirebaseClientConfig } from "abstracted-client";
import { IDictionary } from "common-types";
export * from "./types";
export * from "./firemodelMutations/index";
export { FireModel } from "firemodel";
/**
 * We know that the root state will include the **@firemodel** state tree
 * but otherwise we will accept a generic understanding of the rest of the
 * state tree as this plugin has no means of leveraging any specifics.
 */
export interface IGenericStateTree extends IDictionary {
    "@firemodel": IFiremodelState;
}
export declare let configuration: IFiremodelPluginConfig;
export declare let dbConfig: IFirebaseClientConfig;
export declare let firemodelVuex: Store<any>;
export declare function getDb(config?: IFirebaseClientConfig): Promise<DB>;
export declare function setDb(db: DB): void;
export declare function getAuth(): Promise<import("@firebase/auth-types").FirebaseAuth>;
export declare function setAuth(auth: FirebaseAuth): void;
declare const FirePlugin: (config: IFiremodelPluginConfig) => (store: Store<any>) => void;
export default FirePlugin;
