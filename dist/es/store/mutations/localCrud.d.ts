import { IVuexState } from "../../types";
import { MutationTree } from "vuex";
export declare const localCrud: <T>() => MutationTree<IVuexState<T>>;
