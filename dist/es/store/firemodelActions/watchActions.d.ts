import { IVuexState } from "../../types";
import { ActionTree } from "vuex";
export declare const watchActions: <T>() => ActionTree<IVuexState<T>, T>;
