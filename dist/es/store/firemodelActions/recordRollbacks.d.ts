import { ActionTree } from "vuex";
import { IVuexState } from "../../index";
export declare const recordRollbacks: <T>() => ActionTree<IVuexState<T>, T>;
