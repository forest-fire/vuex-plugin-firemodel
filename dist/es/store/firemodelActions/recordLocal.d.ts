import { IVuexState } from "../../types";
import { ActionTree } from "vuex";
export declare const recordLocal: <T>() => ActionTree<IVuexState<T>, T>;
