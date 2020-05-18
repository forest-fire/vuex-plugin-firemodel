"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRecord = void 0;
/**
 * Detects whether the change is a `Record` or a `List` and ensures
 * that the **state** parameter is typed correctly as well as passing
 * back a boolean flag at runtime.
 */
function isRecord(state, payload) {
    return payload.watcherSource === "record";
}
exports.isRecord = isRecord;
//# sourceMappingURL=isRecord.js.map