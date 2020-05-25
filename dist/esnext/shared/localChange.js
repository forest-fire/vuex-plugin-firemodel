import { FmEvents, Record } from "firemodel";
/**
 * converts a "local change" event into the right data structure
 */
export function localChange(event) {
    const record = Record.createWith(event.modelConstructor, event.value);
    return {
        dbPath: record.dbPath,
        action: mapper(event.type),
        localPath: record.localPath,
        value: event.value,
        timestamp: new Date().getTime()
    };
}
function mapper(evtType) {
    const fields = {
        [FmEvents.RECORD_ADDED_LOCALLY]: "add",
        [FmEvents.RECORD_CHANGED_LOCALLY]: "update",
        [FmEvents.RECORD_REMOVED_LOCALLY]: "remove"
    };
    return fields[evtType] || "unknown";
}
