"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isRecord_1 = require("../shared/isRecord");
const changeRoot_1 = require("../shared/changeRoot");
const updateList_1 = require("../shared/updateList");
function watchEvents(propOffset) {
    const offset = !propOffset ? "all" : propOffset;
    return {
        ["SERVER_STATE_SYNC" /* serverStateSync */](state, payload) {
            console.log(payload);
            if (isRecord_1.isRecord(state, payload)) {
                changeRoot_1.changeRoot(state, payload.value);
            }
            else {
                updateList_1.updateList(state, offset, payload.value);
            }
        }
    };
}
exports.watchEvents = watchEvents;
//# sourceMappingURL=watchEvents.js.map