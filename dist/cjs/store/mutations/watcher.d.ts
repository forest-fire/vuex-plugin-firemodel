import { IFiremodelState } from "../../index";
import { MutationTree } from "vuex";
export declare const watcher: <T>() => MutationTree<IFiremodelState<T>>;
