"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const changeRoot_1 = require("../shared/changeRoot");
const updateList_1 = require("../shared/updateList");
const isRecord_1 = require("../shared/isRecord");
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
function serverRollbacks(propOffset) {
    // default to "all"
    const offset = !propOffset
        ? "all"
        : propOffset;
    return {
        ["ROLLBACK_ADD" /* serverAddRollback */](state, payload) {
            if (isRecord_1.isRecord(state, payload)) {
                changeRoot_1.changeRoot(state, payload.value);
            }
            else {
                updateList_1.updateList(state, offset, payload.value);
            }
        },
        ["ROLLBACK_CHANGE" /* serverChangeRollback */](state, payload) {
            if (isRecord_1.isRecord(state, payload)) {
                changeRoot_1.changeRoot(state, payload.value);
            }
            else {
                updateList_1.updateList(state, offset, payload.value);
            }
        },
        ["ROLLBACK_REMOVE" /* serverRemoveRollback */](state, payload) {
            if (isRecord_1.isRecord(state, payload)) {
                changeRoot_1.changeRoot(state, payload.value);
            }
            else {
                updateList_1.updateList(state, offset, payload.value);
            }
        }
    };
}
exports.serverRollbacks = serverRollbacks;
//# sourceMappingURL=serverRollbacks.js.map