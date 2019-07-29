import { MutationTree } from "vuex";
import { IFiremodelState } from "../../types/firemodel";
/**
 * The **mutations** associated to errors encountered during the
 * plugin's execution.
 */
export declare const errorMutations: <T>() => MutationTree<IFiremodelState<T>>;
