import { changeRoot } from "../shared/changeRoot";
import { updateList } from "../shared/updateList";
export function serverEvents(propOffset) {
    const offset = !propOffset ? "all" : propOffset;
    return {
        ["SERVER_ADD" /* serverAdd */](
        /**
         * either a dictionary which includes the "offsetProp" or the array
         * of records at the root of the state structure
         */
        state, payload) {
            const isRecord = payload.watcherSource === "record";
            if (isRecord) {
                changeRoot(state, payload.value);
            }
            else {
                updateList(state, offset, payload.value);
            }
        },
        ["SERVER_CHANGE" /* serverChange */](
        /**
         * Either a dictionary which includes the "offsetProp" or the array
         * of records at the root of the state structure
         */
        state, payload) {
            const isRecord = payload.watcherSource === "record";
            if (payload.value === null) {
                // a "remove" event will also be picked up by the "change" event
                // passed by Firebase. This mutation will be ignored with the
                // assumption that the "remove" mutation will handle the state
                // change.
                return;
            }
            if (isRecord) {
                changeRoot(state, payload.value);
            }
            else {
                updateList(state, offset, payload.value);
            }
        },
        ["SERVER_REMOVE" /* serverRemove */](
        /**
         * either a dictionary which includes the "offsetProp" or the array
         * of records at the root of the state structure
         */
        state, payload) {
            const isRecord = payload.watcherSource === "record";
            if (isRecord) {
                changeRoot(state, null);
            }
            else {
                updateList(state, offset, payload.value);
            }
        }
    };
}
