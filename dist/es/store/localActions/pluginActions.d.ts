import { IVuexState } from "../../types";
import { ActionTree } from "vuex";
/**
 * **pluginActions**
 *
 * The core services that this plugin provides are exposed as Vuex actions
 */
export declare const pluginActions: <T>() => ActionTree<IVuexState<T>, T>;
