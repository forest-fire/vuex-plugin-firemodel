"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firemodel_1 = require("firemodel");
/**
 * converts a "local change" event into the right data structure
 */
function localChange(event) {
    const record = firemodel_1.Record.createWith(event.modelConstructor, event.value);
    return {
        dbPath: record.dbPath,
        action: mapper(event.type),
        localPath: record.localPath,
        value: event.value,
        timestamp: new Date().getTime()
    };
}
exports.localChange = localChange;
function mapper(evtType) {
    const fields = {
        [firemodel_1.FmEvents.RECORD_ADDED_LOCALLY]: "add",
        [firemodel_1.FmEvents.RECORD_CHANGED_LOCALLY]: "update",
        [firemodel_1.FmEvents.RECORD_REMOVED_LOCALLY]: "remove"
    };
    return fields[evtType] || "unknown";
}
//# sourceMappingURL=localChange.js.map