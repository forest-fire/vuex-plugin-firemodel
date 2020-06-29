import { IVuexState } from "../../types";
import { ActionTree } from "vuex";
export declare const recordServerChanges: <T>() => ActionTree<IVuexState<T>, T>;
