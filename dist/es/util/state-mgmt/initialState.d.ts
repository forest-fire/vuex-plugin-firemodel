import { IDictionary } from "common-types";
/**
 * Set the "initial state" (aka, the initial synchronous starting state)
 */
export declare function setInitialState(state: IDictionary): void;
/**
 * The state which the Vuex state tree starts out in
 */
export declare function getInitialState<T = IDictionary>(): T;
