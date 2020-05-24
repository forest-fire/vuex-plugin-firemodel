import { IVuexState } from "../../private";
import { MutationTree } from "vuex";
export declare const relationships: <T>() => MutationTree<IVuexState<T>>;
