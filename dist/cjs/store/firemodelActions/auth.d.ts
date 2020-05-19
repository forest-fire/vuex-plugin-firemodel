import { ActionTree } from "vuex";
import { IFiremodelState } from "../../private";
/**
 * **authActions**
 *
 * The Firebase AUTH actions which this plugin will execute for the user
 */
export declare const authActions: <T>() => ActionTree<IFiremodelState<T>, T>;
