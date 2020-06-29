import { IVuexState } from "../../types";
import { MutationTree } from "vuex";
/**
 * The **mutations** scoped to the local configuration of Firebase
 */
export declare const localConfig: <T>() => MutationTree<IVuexState<T>>;
