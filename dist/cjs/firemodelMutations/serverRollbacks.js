"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverRollbacks = void 0;
const shared_1 = require("../shared");
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
            if (shared_1.isRecord(state, payload)) {
                shared_1.changeRoot(state, payload.value, payload.localPath);
            }
            else {
                shared_1.updateList(state, offset, payload.value);
            }
        },
        ["ROLLBACK_CHANGE" /* serverChangeRollback */](state, payload) {
            if (shared_1.isRecord(state, payload)) {
                shared_1.changeRoot(state, payload.value, payload.localPath);
            }
            else {
                shared_1.updateList(state, offset, payload.value);
            }
        },
        ["ROLLBACK_REMOVE" /* serverRemoveRollback */](state, payload) {
            if (shared_1.isRecord(state, payload)) {
                shared_1.changeRoot(state, payload.value, payload.localPath);
            }
            else {
                shared_1.updateList(state, offset, payload.value);
            }
        }
    };
}
exports.serverRollbacks = serverRollbacks;
//# sourceMappingURL=serverRollbacks.js.map