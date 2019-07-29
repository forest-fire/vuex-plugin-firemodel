import { IFiremodelState } from "../types";

/**
 * The default state for this plugin's **Vuex** state node
 */
export const state: <T>() => IFiremodelState<T> = <T>() => ({
  authenticated: false,
  status: "unconfigured",
  queued: [],
  watching: [],
  localOnly: {}
});
