import { isRecord } from "../shared/isRecord";
import { changeRoot } from "../shared/changeRoot";
import { updateList } from "../shared/updateList";
export function reset(propOffset) {
    const offset = !propOffset ? "all" : propOffset;
    return {
        reset(state, payload) {
            if (isRecord(state, payload)) {
                changeRoot(state, null);
            }
            else {
                updateList(state, offset, []);
            }
        }
    };
}
