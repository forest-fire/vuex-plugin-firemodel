import { changeRoot } from "../shared/changeRoot";
export function serverEvents(propOffset) {
    return {
        ["SERVER_ADD" /* serverAdd */](state, payload) {
            const isRecord = payload.watcherSource === "record";
            state = isRecord
                ? changeRoot(state, payload.value)
                : propOffset
                    ? state[propOffset].push(payload.value)
                    : state.push(payload.value);
        },
        ["SERVER_CHANGE" /* serverChange */](state, payload) {
            const isRecord = payload.watcherSource === "record";
            const updatedList = (list) => {
                if (payload.value === null) {
                    // a "remove" event will also be picked up by the "change" event
                    // passed by Firebase. This mutation will be ignored with the
                    // assumption that the "remove" mutation will handle the state
                    // change.
                    return list || [];
                }
                if (!(list || []).map(i => i.id).includes(payload.value.id)) {
                    // The "change" is to a record which did not previously
                    // exist. This is because "change" is a superset of add/remove/update.
                    // It is asssumed in this case that the "serverAdd" event will have
                    // taken care of the needed state change.
                    return list || [];
                }
                return (list || []).map(i => {
                    return i.id === payload.value.id ? payload.value : i;
                });
            };
            state = isRecord
                ? changeRoot(state, payload.value)
                : propOffset
                    ? (state[propOffset] = updatedList(payload.value))
                    : (state = updatedList(payload.value));
        },
        ["SERVER_REMOVE" /* serverRemove */](state, payload) {
            const isRecord = payload.watcherSource === "record";
            state = isRecord
                ? changeRoot(state, payload.value)
                : propOffset
                    ? (state[propOffset] = null)
                    : (state = null);
        }
    };
}
