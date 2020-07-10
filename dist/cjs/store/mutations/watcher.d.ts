import { IFiremodelState } from "../../types";
import { MutationTree } from "vuex";
export declare const watcher: <T>() => MutationTree<IFiremodelState<T>>;
