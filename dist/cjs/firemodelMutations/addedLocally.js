"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const changeRoot_1 = require("../shared/changeRoot");
const updateList_1 = require("../shared/updateList");
function addedLocally(propOffset) {
    const offset = !propOffset ? "all" : propOffset;
    return {
        ["ADDED_LOCALLY" /* addedLocally */](state, payload) {
            const isRecord = payload.watcherSource === "record";
            if (isRecord) {
                changeRoot_1.changeRoot(state, payload.value);
            }
            else {
                updateList_1.updateList(state, offset, payload.value);
            }
        },
        ["CHANGED_LOCALLY" /* changedLocally */](state, payload) {
            const isRecord = payload.watcherSource === "record";
            if (isRecord) {
                changeRoot_1.changeRoot(state, payload.value);
            }
            else {
                updateList_1.updateList(state, offset, payload.value);
            }
        },
        ["REMOVED_LOCALLY" /* removedLocally */](state, payload) {
            const isRecord = payload.watcherSource === "record";
            if (isRecord) {
                changeRoot_1.changeRoot(state, null);
            }
            else {
                updateList_1.updateList(state, offset, null);
            }
        }
    };
}
exports.addedLocally = addedLocally;
//# sourceMappingURL=addedLocally.js.map