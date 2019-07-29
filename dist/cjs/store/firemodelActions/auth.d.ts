import { ActionTree } from "vuex";
import { IFiremodelState } from "../../index";
/**
 * **authActions**
 *
 * The Firebase AUTH actions which this plugin will execute for the user
 */
export declare const authActions: <T>() => ActionTree<IFiremodelState<T>, T>;
