import { IVuexState } from "../../types";
import { MutationTree } from "vuex";
export declare const relationships: <T>() => MutationTree<IVuexState<T>>;
