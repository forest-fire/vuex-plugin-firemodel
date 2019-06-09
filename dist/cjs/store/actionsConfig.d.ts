import { ActionTree } from "vuex";
import { IFiremodelState } from "../types";
import { IGenericStateTree } from "..";
/**
 * **actionsConfig**
 *
 * This plugin has two actions which it services: **config** and **crud**.
 * This defines the _config_ actions only. The configuration actions are
 * sort of what they say on the tin ... things which involve configuring
 * this plug.
 */
export declare const actionsConfig: ActionTree<IFiremodelState, IGenericStateTree>;
