import { IVuexState } from "../../types";
import { MutationTree } from "vuex";
export declare const watcher: <T>() => MutationTree<IVuexState<T>>;
