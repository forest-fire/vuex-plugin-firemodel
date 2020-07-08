import { IFiremodelState } from "../../types";
import { MutationTree } from "vuex";
export declare const serverRollback: <T>() => MutationTree<IFiremodelState<T>>;
