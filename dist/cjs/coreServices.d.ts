import { Store } from "vuex";
import { IFiremodelConfig } from "./private";
/**
 * Based on the configuration passed in by the consuming app, core
 * services will be started by firing off the appropriate Vuex _action_.
 */
export declare function coreServices<T>(store: Store<T>, config?: IFiremodelConfig<T>): Promise<void>;
