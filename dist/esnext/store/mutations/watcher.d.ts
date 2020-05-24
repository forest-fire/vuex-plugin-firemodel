import { IVuexState } from "../../private";
import { MutationTree } from "vuex";
export declare const watcher: <T>() => MutationTree<IVuexState<T>>;
