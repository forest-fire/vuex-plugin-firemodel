export function listMutations(postfix) {
    return {
        ADD(state, payload) {
            state[postfix].push(payload.value);
        },
        CHANGED(state, payload) { },
        REMOVED(state, payload) { },
        RELATIONSHIP_ADDED(state, payload) { },
        RELATIONSHIP_REMOVED(state, payload) { }
    };
}
