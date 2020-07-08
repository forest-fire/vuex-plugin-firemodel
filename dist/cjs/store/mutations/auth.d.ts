import { IFiremodelState } from "../../types";
import { MutationTree } from "vuex";
/**
 * The **mutations** associated to the Firebase Auth API.
 */
export declare const authMutations: <T>() => MutationTree<IFiremodelState<T>>;
