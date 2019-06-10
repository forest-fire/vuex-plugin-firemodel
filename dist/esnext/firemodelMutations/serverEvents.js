export function serverEvents(propOffset) {
    return {
        ["SERVER_ADD" /* serverAdd */](state, payload) {
            const offset = propOffset
                ? propOffset
                : payload.watcherSource === "list"
                    ? "all"
                    : "";
            state = offset ? { state, [offset]: payload.value } : payload.value;
        },
        ["SERVER_CHANGE" /* serverChange */](state, payload) {
            // TODO: implement
            console.log("TODO: server-change");
        },
        ["SERVER_REMOVE" /* serverRemove */](state, payload) {
            // TODO: implement
            console.log("TODO: server-remove");
        }
    };
}
