import { IVuexState } from "../../types";
import { ActionTree } from "vuex";
export declare const relationship: <T>() => ActionTree<IVuexState<T>, T>;
