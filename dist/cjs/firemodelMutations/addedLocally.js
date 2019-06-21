"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const changeRoot_1 = require("../shared/changeRoot");
const localChange_1 = require("../shared/localChange");
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
            state.localOnly = state.localOnly.concat(localChange_1.localChange(payload));
        }
    };
}
exports.addedLocally = addedLocally;
//# sourceMappingURL=addedLocally.js.map