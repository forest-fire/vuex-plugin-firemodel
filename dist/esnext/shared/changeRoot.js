import Vue from "vue";
import { initialState } from "..";
import { FireModelPluginError } from "../private";
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
export const changeRoot = (state, updatedProps, moduleName) => {
    /** the full set of props defined by both current and new state */
    const properties = Array.from(new Set(Object.keys(state).concat(updatedProps ? Object.keys(updatedProps) : [])));
    if (initialState[moduleName] === undefined) {
        throw new FireModelPluginError(`Attempt to change the state of the Vuex module "${moduleName}" failed because there was no initial state defined for that module. Please check that the spelling is correct as this is typically a typo.`);
    }
    properties.forEach(prop => {
        const newState = updatedProps ? updatedProps[prop] : null;
        const oldState = state[prop];
        const defaultState = initialState[moduleName][prop];
        Vue.set(state, prop, newState === null ? defaultState : newState);
        // state[prop as keyof T] = newState === null ? defaultState : newState;
    });
    return state;
};
