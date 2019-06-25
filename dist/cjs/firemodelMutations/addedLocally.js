"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const changeRoot_1 = require("../shared/changeRoot");
function addedLocally(propOffset) {
    return {
        ["ADDED_LOCALLY" /* addedLocally */](state, payload) {
            const isRecord = payload.watcherSource === "record";
            state = isRecord
                ? changeRoot_1.changeRoot(state, payload.value)
                : (state[propOffset] = payload.value);
        },
        ["CHANGED_LOCALLY" /* changedLocally */](state, payload) {
            const isRecord = payload.watcherSource === "record";
            state = isRecord
                ? changeRoot_1.changeRoot(state, payload.value)
                : (state[propOffset] = payload.value);
        },
        ["REMOVED_LOCALLY" /* removedLocally */](state, payload) {
            const isRecord = payload.watcherSource === "record";
            state = isRecord
                ? changeRoot_1.changeRoot(state, payload.value)
                : (state[propOffset] = payload.value);
        }
    };
}
exports.addedLocally = addedLocally;
//# sourceMappingURL=addedLocally.js.map