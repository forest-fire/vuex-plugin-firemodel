import { ActionTree } from "vuex";
import { IFiremodelState } from "../../types";
/**
 * **pluginActions**
 *
 * The core services that this plugin provides are exposed as Vuex actions
 */
export declare const pluginActions: <T>() => ActionTree<IFiremodelState<T>, T>;
