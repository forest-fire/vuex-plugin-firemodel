import { IVuexState } from "../../private";
import { ActionTree } from "vuex";
export declare const watchActions: <T>() => ActionTree<IVuexState<T>, T>;
