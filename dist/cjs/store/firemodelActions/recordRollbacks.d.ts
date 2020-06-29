import { IVuexState } from "../../types";
import { ActionTree } from "vuex";
export declare const recordRollbacks: <T>() => ActionTree<IVuexState<T>, T>;
