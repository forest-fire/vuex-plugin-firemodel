import { IVuexState } from "../../private";
import { MutationTree } from "vuex";
export declare const serverRollback: <T>() => MutationTree<IVuexState<T>>;
