import { IVuexState } from "../types";

/**
 * The default state for this plugin's **Vuex** state node
 */
export const state: <T>() => IVuexState<T> = <T>() => ({
  authenticated: false,
  status: "unconfigured",
  queued: [],
  watching: [],
  localOnly: {},
  muted: []
});
