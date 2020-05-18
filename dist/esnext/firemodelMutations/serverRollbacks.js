import { changeRoot, updateList, isRecord } from "../private";
/**
 * **serverConfirms**
 *
 * When the client originates an event, it first triggers `local` mutations
 * as the first part of the "two phased commit", then when this action is
 * validated by the Firebase DB it sends a confirm message.
 *
 * The goal of this plugin for _rollbacks_ is to immediately change the state
 * back to what it had been before it had been optimistically set by the `local`
 * mutation.
 */
export function serverRollbacks(propOffset) {
    // default to "all"
    const offset = !propOffset
        ? "all"
        : propOffset;
    return {
        ["ROLLBACK_ADD" /* serverAddRollback */](state, payload) {
            if (isRecord(state, payload)) {
                changeRoot(state, payload.value, payload.localPath);
            }
            else {
                updateList(state, offset, payload.value);
            }
        },
        ["ROLLBACK_CHANGE" /* serverChangeRollback */](state, payload) {
            if (isRecord(state, payload)) {
                changeRoot(state, payload.value, payload.localPath);
            }
            else {
                updateList(state, offset, payload.value);
            }
        },
        ["ROLLBACK_REMOVE" /* serverRemoveRollback */](state, payload) {
            if (isRecord(state, payload)) {
                changeRoot(state, payload.value, payload.localPath);
            }
            else {
                updateList(state, offset, payload.value);
            }
        }
    };
}
