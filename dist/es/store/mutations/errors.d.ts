import { IVuexState } from "../../types";
import { MutationTree } from "vuex";
/**
 * The **mutations** associated to errors encountered during the
 * plugin's execution.
 */
export declare const errorMutations: <T>() => MutationTree<IVuexState<T>>;
