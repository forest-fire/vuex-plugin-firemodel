import { changeRoot, isRecord, updateList } from "../shared";
export function addedLocally(propOffset) {
    const offset = !propOffset ? "all" : propOffset;
    return {
        ["ADDED_LOCALLY" /* addedLocally */](state, payload) {
            if (isRecord(state, payload)) {
                changeRoot(state, payload.value, payload.localPath);
            }
            else {
                updateList(state, offset, payload.value);
            }
        },
        ["CHANGED_LOCALLY" /* changedLocally */](state, payload) {
            if (isRecord(state, payload)) {
                changeRoot(state, payload.value, payload.localPath);
            }
            else {
                updateList(state, offset, payload.value);
            }
        },
        ["REMOVED_LOCALLY" /* removedLocally */](state, payload) {
            if (isRecord(state, payload)) {
                changeRoot(state, null, payload.localPath);
            }
            else {
                updateList(state, offset, null);
            }
        }
    };
}
