"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const changeRoot_1 = require("../shared/changeRoot");
function serverEvents(propOffset) {
    return {
        ["SERVER_ADD" /* serverAdd */](state, payload) {
            const isRecord = payload.watcherSource === "record";
            state = isRecord
                ? changeRoot_1.changeRoot(state, payload.value)
                : propOffset
                    ? state[propOffset].push(payload.value)
                    : state.push(payload.value);
        },
        ["SERVER_CHANGE" /* serverChange */](state, payload) {
            const isRecord = payload.watcherSource === "record";
            const updatedList = (list) => {
                return list.map(i => {
                    return i.id === payload.value.id ? payload.value : i;
                });
            };
            state = isRecord
                ? changeRoot_1.changeRoot(state, payload.value)
                : propOffset
                    ? (state[propOffset] = updatedList(payload.value))
                    : (state = updatedList(payload.value));
        },
        ["SERVER_REMOVE" /* serverRemove */](state, payload) {
            const isRecord = payload.watcherSource === "record";
            state = isRecord
                ? changeRoot_1.changeRoot(state, payload.value)
                : propOffset
                    ? (state[propOffset] = null)
                    : (state = null);
        }
    };
}
exports.serverEvents = serverEvents;
//# sourceMappingURL=serverEvents.js.map