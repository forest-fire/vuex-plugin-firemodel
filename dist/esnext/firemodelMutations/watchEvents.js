import { isRecord } from "../shared/isRecord";
import { changeRoot } from "../shared/changeRoot";
import { updateList } from "../shared/updateList";
export function watchEvents(propOffset) {
    const offset = !propOffset ? "all" : propOffset;
    return {
        ["SERVER_STATE_SYNC" /* serverStateSync */](state, payload) {
            console.log(payload);
            if (isRecord(state, payload)) {
                changeRoot(state, payload.value);
            }
            else {
                updateList(state, offset, payload.value);
            }
        }
    };
}
