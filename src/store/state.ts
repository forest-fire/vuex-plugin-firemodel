import { IFiremodelState } from "../types";

/**
 * The default state for this plugin's **Vuex** state node
 */
export const state: IFiremodelState = {
  authenticated: false,
  status: "unconfigured",
  queued: [],
  watching: [],
  localOnly: []
};
