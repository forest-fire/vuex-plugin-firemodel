"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = __importDefault(require("vue"));
const __1 = require("..");
const FiremodelPluginError_1 = require("../errors/FiremodelPluginError");
/**
 * **changeRoot**
 *
 * Allows a mutation to reset the root object of a module's
 * state tree while avoiding the classic object "de-referencing"
 * which can result in the state tree not being updated.
 *
 * @param state
 * @param updatedProps
 */
exports.changeRoot = (state, updatedProps, moduleName) => {
    /** the full set of props defined by both current and new state */
    const properties = Array.from(new Set(Object.keys(state).concat(updatedProps ? Object.keys(updatedProps) : [])));
    if (__1.initialState[moduleName] === undefined) {
        throw new FiremodelPluginError_1.FireModelPluginError(`Attempt to change the state of the Vuex module "${moduleName}" failed because there was no initial state defined for that module. Please check that the spelling is correct as this is typically a typo.`);
    }
    properties.forEach(prop => {
        const newState = updatedProps ? updatedProps[prop] : null;
        const oldState = state[prop];
        const defaultState = __1.initialState[moduleName][prop];
        vue_1.default.set(state, prop, newState === null ? defaultState : newState);
        // state[prop as keyof T] = newState === null ? defaultState : newState;
    });
    return state;
};
//# sourceMappingURL=changeRoot.js.map