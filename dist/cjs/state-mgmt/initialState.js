"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInitialState = exports.setInitialState = void 0;
let _initialState;
/**
 * Set the "initial state" (aka, the initial synchronous starting state)
 */
function setInitialState(state) {
    _initialState = state;
}
exports.setInitialState = setInitialState;
/**
 * The state which the Vuex state tree starts out in
 */
function getInitialState() {
    return _initialState;
}
exports.getInitialState = getInitialState;
//# sourceMappingURL=initialState.js.map