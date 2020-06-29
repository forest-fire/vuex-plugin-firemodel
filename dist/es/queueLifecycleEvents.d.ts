import { IFiremodelConfig } from "./types";
import { Store } from "vuex";
export declare function queueLifecycleEvents<T>(store: Store<T>, config?: IFiremodelConfig<T>): Promise<void>;
