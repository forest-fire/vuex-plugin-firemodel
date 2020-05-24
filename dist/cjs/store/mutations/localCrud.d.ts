import { IVuexState } from "../../private";
import { MutationTree } from "vuex";
export declare const localCrud: <T>() => MutationTree<IVuexState<T>>;
