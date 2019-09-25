import Vue from "vue";
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
export const changeRoot = (state, updatedProps) => {
    if (updatedProps === null) {
        Object.keys(state).forEach(p => Vue.set(state, p, undefined));
        return;
    }
    /**
     * rather than replace the root object reference,
     * iterate through each property and change that
     */
    Object.keys(updatedProps).forEach((v) => {
        Vue.set(state, v, updatedProps[v]);
    });
    /**
     * If the `newValues` passed in omitted properties but the state
     * tree has values for it we must remove those properties as this
     * is a "destructive" update.
     */
    const removed = Object.keys(state).filter(k => k && !Object.keys(updatedProps).includes(k));
    Object.keys(removed).forEach(k => {
        Vue.set(state, k, {});
        // delete (state as T)[k as keyof typeof state];
    });
    return state;
};
