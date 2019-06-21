import { changeRoot } from "../shared/changeRoot";
import { localChange } from "../shared/localChange";
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
            state.localOnly = state.localOnly.concat(localChange(payload));
        }
    };
}
