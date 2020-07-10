import { IFiremodelState } from "../../types";
import { MutationTree } from "vuex";
export declare const relationships: <T>() => MutationTree<IFiremodelState<T>>;
