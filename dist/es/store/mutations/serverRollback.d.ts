import { IVuexState } from "../../types";
import { MutationTree } from "vuex";
export declare const serverRollback: <T>() => MutationTree<IVuexState<T>>;
