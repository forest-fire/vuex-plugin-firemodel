"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverEvents = void 0;
const shared_1 = require("../shared");
function serverEvents(propOffset) {
    const offset = !propOffset ? "all" : propOffset;
    return {
        ["SERVER_ADD" /* serverAdd */](
        /**
         * either a dictionary which includes the "offsetProp" or the array
         * of records at the root of the state structure
         */
        state, payload) {
            if (shared_1.isRecord(state, payload)) {
                shared_1.changeRoot(state, payload.value, payload.localPath);
            }
            else {
                shared_1.updateList(state, offset, payload.value);
            }
        },
        ["SERVER_CHANGE" /* serverChange */](
        /**
         * Either a dictionary which includes the "offsetProp" or the array
         * of records at the root of the state structure
         */
        state, payload) {
            if (payload.value === null) {
                // a "remove" event will also be picked up by the "change" event
                // passed by Firebase. This mutation will be ignored with the
                // assumption that the "remove" mutation will handle the state
                // change.
                return;
            }
            if (shared_1.isRecord(state, payload)) {
                shared_1.changeRoot(state, payload.value, payload.localPath);
            }
            else {
                shared_1.updateList(state, offset, payload.value);
            }
        },
        ["SERVER_REMOVE" /* serverRemove */](
        /**
         * either a dictionary which includes the "offsetProp" or the array
         * of records at the root of the state structure
         */
        state, payload) {
            if (shared_1.isRecord(state, payload)) {
                shared_1.changeRoot(state, null, payload.localPath);
            }
            else {
                shared_1.updateList(state, offset, payload.value);
            }
        }
    };
}
exports.serverEvents = serverEvents;
//# sourceMappingURL=serverEvents.js.map