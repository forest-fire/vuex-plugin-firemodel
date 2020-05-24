import { IVuexState } from "../../private";
import { ActionTree } from "vuex";
export declare const watch: <T>() => ActionTree<IVuexState<T>, T>;
