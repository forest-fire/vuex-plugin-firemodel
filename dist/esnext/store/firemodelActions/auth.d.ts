import { IVuexState } from "../../private";
import { ActionTree } from "vuex";
/**
 * **authActions**
 *
 * The Firebase AUTH actions which this plugin will execute for the user
 */
export declare const authActions: <T>() => ActionTree<IVuexState<T>, T>;
