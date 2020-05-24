"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addedLocally = void 0;
const private_1 = require("../private");
function addedLocally(propOffset) {
    const offset = !propOffset ? "all" : propOffset;
    return {
        ["ADDED_LOCALLY" /* addedLocally */](state, payload) {
            if (private_1.isRecord(state, payload)) {
                private_1.changeRoot(state, payload.value, payload.localPath);
            }
            else {
                private_1.updateList(state, offset, payload.value);
            }
        },
        ["CHANGED_LOCALLY" /* changedLocally */](state, payload) {
            if (private_1.isRecord(state, payload)) {
                private_1.changeRoot(state, payload.value, payload.localPath);
            }
            else {
                private_1.updateList(state, offset, payload.value);
            }
        },
        ["REMOVED_LOCALLY" /* removedLocally */](state, payload) {
            if (private_1.isRecord(state, payload)) {
                private_1.changeRoot(state, null, payload.localPath);
            }
            else {
                private_1.updateList(state, offset, null);
            }
        }
    };
}
exports.addedLocally = addedLocally;
//# sourceMappingURL=addedLocally.js.map