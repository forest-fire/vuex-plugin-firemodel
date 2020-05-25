let _initialState;
/**
 * Set the "initial state" (aka, the initial synchronous starting state)
 */
export function setInitialState(state) {
    _initialState = state;
}
/**
 * The state which the Vuex state tree starts out in
 */
export function getInitialState() {
    return _initialState;
}
