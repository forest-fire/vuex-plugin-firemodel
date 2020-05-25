import { ActionTree } from "vuex";
import { IVuexState } from "../../index";
export declare const recordServerChanges: <T>() => ActionTree<IVuexState<T>, T>;
