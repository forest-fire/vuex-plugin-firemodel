"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addedLocally = void 0;
const shared_1 = require("../shared");
function addedLocally(propOffset) {
    const offset = !propOffset ? "all" : propOffset;
    return {
        ["ADDED_LOCALLY" /* addedLocally */](state, payload) {
            if (shared_1.isRecord(state, payload)) {
                shared_1.changeRoot(state, payload.value, payload.localPath);
            }
            else {
                shared_1.updateList(state, offset, payload.value);
            }
        },
        ["CHANGED_LOCALLY" /* changedLocally */](state, payload) {
            if (shared_1.isRecord(state, payload)) {
                shared_1.changeRoot(state, payload.value, payload.localPath);
            }
            else {
                shared_1.updateList(state, offset, payload.value);
            }
        },
        ["REMOVED_LOCALLY" /* removedLocally */](state, payload) {
            if (shared_1.isRecord(state, payload)) {
                shared_1.changeRoot(state, null, payload.localPath);
            }
            else {
                shared_1.updateList(state, offset, null);
            }
        }
    };
}
exports.addedLocally = addedLocally;
//# sourceMappingURL=addedLocally.js.map