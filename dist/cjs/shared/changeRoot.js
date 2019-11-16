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
        state[prop] = newState === null ? defaultState : newState;
    });
    if (updatedProps === null) {
        return Object.keys(state).forEach(p => vue_1.default.set(state, p, updatedProps && updatedProps[p] ? updatedProps[p] : __1.initialState[p]));
    }
    /**
     * rather than replace the root object reference,
     * iterate through each property and change that
     */
    Object.keys(updatedProps).forEach((v) => {
        vue_1.default.set(state, v, updatedProps[v]);
    });
    /**
     * If the `newValues` passed in omitted properties but the state
     * tree has values for it we must remove those properties as this
     * is a "destructive" update.
     */
    const removed = Object.keys(state).filter(k => k && !Object.keys(updatedProps).includes(k));
    Object.keys(removed).forEach(k => {
        vue_1.default.set(state, k, {});
        // delete (state as T)[k as keyof typeof state];
    });
    return state;
};
//# sourceMappingURL=changeRoot.js.map