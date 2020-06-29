import { IDictionary } from "common-types";

let _initialState: IDictionary;

/**
 * Set the "initial state" (aka, the initial synchronous starting state)
 */
export function setInitialState(state: IDictionary) {
  _initialState = state;
}

/**
 * The state which the Vuex state tree starts out in
 */
export function getInitialState<T = IDictionary>() {
  return _initialState as T;
}
