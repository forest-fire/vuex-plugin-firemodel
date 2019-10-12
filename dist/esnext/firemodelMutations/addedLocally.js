import { changeRoot } from "../shared/changeRoot";
import { updateList } from "../shared/updateList";
import { isRecord } from "../shared/isRecord";
export function addedLocally(propOffset) {
    const offset = !propOffset ? "all" : propOffset;
    return {
        ["ADDED_LOCALLY" /* addedLocally */](state, payload) {
            if (isRecord(state, payload)) {
                changeRoot(state, payload.value);
            }
            else {
                updateList(state, offset, payload.value);
            }
        },
        ["CHANGED_LOCALLY" /* changedLocally */](state, payload) {
            if (isRecord(state, payload)) {
                changeRoot(state, payload.value);
            }
            else {
                updateList(state, offset, payload.value);
            }
        },
        ["REMOVED_LOCALLY" /* removedLocally */](state, payload) {
            if (isRecord(state, payload)) {
                changeRoot(state, null);
            }
            else {
                updateList(state, offset, null);
            }
        }
    };
}
