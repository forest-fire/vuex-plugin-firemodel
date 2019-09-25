/**
 * Detects whether the change is a `Record` or a `List` and ensures
 * that the **state** parameter is typed correctly as well as passing
 * back a boolean flag at runtime.
 */
export function isRecord(state, payload) {
    return payload.watcherSource === "record";
}
