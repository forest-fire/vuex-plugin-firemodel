import Vue from "vue";
/**
 * **changeRoot**
 *
 * Allows a mutation to reset the root object of a module's
 * state tree while avoiding the classic object "de-referencing"
 * which can result in the state tree not being updated.
 *
 * @param state
 * @param newValues
 */
export const changeRoot = (state, newValues) => {
    if (newValues === null) {
        state = null;
        return;
    }
    // ensure state is set to T
    state = (state !== null ? state : {});
    /**
     * rather than replace the root object reference,
     * iterate through each property and change that
     */
    Object.keys(newValues).forEach((v) => {
        Vue.set(state, v, newValues[v]);
    });
    /**
     * If the `newValues` passed in omitted properties but the state
     * tree has values for it we must remove those properties as this
     * is a "destructive" update.
     */
    const removed = Object.keys(state).filter(k => k && !Object.keys(newValues).includes(k));
    Object.keys(removed).forEach(k => {
        delete state[k];
    });
    return state;
};
