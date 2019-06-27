import { changeRoot } from "../shared/changeRoot";
import { updateList } from "../shared/updateList";
export function addedLocally(propOffset) {
    const offset = !propOffset ? "all" : propOffset;
    return {
        ["ADDED_LOCALLY" /* addedLocally */](state, payload) {
            const isRecord = payload.watcherSource === "record";
            if (isRecord) {
                changeRoot(state, payload.value);
            }
            else {
                updateList(state, offset, payload.value);
            }
        },
        ["CHANGED_LOCALLY" /* changedLocally */](state, payload) {
            const isRecord = payload.watcherSource === "record";
            if (isRecord) {
                changeRoot(state, payload.value);
            }
            else {
                updateList(state, offset, payload.value);
            }
        },
        ["REMOVED_LOCALLY" /* removedLocally */](state, payload) {
            const isRecord = payload.watcherSource === "record";
            if (isRecord) {
                changeRoot(state, null);
            }
            else {
                updateList(state, offset, null);
            }
        }
    };
}
