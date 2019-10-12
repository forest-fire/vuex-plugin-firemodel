import { MutationTree } from "vuex";
import { IFiremodelState } from "../../types";
/**
 * The **mutations** scoped to the local configuration of Firebase
 */
export declare const localConfig: <T>() => MutationTree<IFiremodelState<T>>;
