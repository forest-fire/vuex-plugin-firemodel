import { localChange } from "../../shared/localChange";
export const localCrud = {
    ["ADDED_LOCALLY" /* addedLocally */](state, payload) {
        const p = payload;
        state.localOnly = state.localOnly.concat({
            action: "add",
            dbPath: p.dbPath,
            localPath: p.localPath,
            value: p.value,
            timestamp: new Date().getTime()
        });
    },
    ["CHANGED_LOCALLY" /* changedLocally */](state, payload) {
        const p = payload;
        state.localOnly = state.localOnly.concat({
            action: "update",
            dbPath: p.dbPath,
            localPath: p.localPath,
            value: p.value,
            timestamp: new Date().getTime()
        });
    },
    ["REMOVED_LOCALLY" /* removedLocally */](state, payload) {
        state.localOnly = state.localOnly.concat(localChange(payload));
    }
};
