import { IFiremodelConfig as IFiremodelPluginConfig, IFiremodelState } from "./types";
import { Store } from "vuex";
import { DB, FirebaseAuth } from "abstracted-client";
import { IDictionary } from "common-types";
import { IFirebaseClientConfig } from "abstracted-firebase";
export * from "./types";
/**
 * We know that the root state will include the **@firemodel** state tree
 * but otherwise we will accept a generic understanding unless passed
 * more specifics. This interface represents the generic understanding.
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
declare const FirePlugin: (config?: IFiremodelPluginConfig) => (store: Store<IGenericStateTree>) => Promise<void>;
export default FirePlugin;
