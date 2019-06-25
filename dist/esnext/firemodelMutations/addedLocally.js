import { changeRoot } from "../shared/changeRoot";
export function addedLocally(propOffset) {
    return {
        ["ADDED_LOCALLY" /* addedLocally */](state, payload) {
            const isRecord = payload.watcherSource === "record";
            state = isRecord
                ? changeRoot(state, payload.value)
                : (state[propOffset] = payload.value);
        },
        ["CHANGED_LOCALLY" /* changedLocally */](state, payload) {
            const isRecord = payload.watcherSource === "record";
            state = isRecord
                ? changeRoot(state, payload.value)
                : (state[propOffset] = payload.value);
        },
        ["REMOVED_LOCALLY" /* removedLocally */](state, payload) {
            const isRecord = payload.watcherSource === "record";
            state = isRecord
                ? changeRoot(state, payload.value)
                : (state[propOffset] = payload.value);
        }
    };
}
