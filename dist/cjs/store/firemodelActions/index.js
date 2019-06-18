"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recordServerChanges_1 = require("./recordServerChanges");
const watch_1 = require("./watch");
const relationship_1 = require("./relationship");
const recordLocal_1 = require("./recordLocal");
const recordConfirms_1 = require("./recordConfirms");
const recordRollbacks_1 = require("./recordRollbacks");
exports.firemodelActions = stripNamespaceFromKeys(Object.assign({}, recordServerChanges_1.recordServerChanges, recordLocal_1.recordLocal, recordConfirms_1.recordConfirms, recordRollbacks_1.recordRollbacks, watch_1.watch, relationship_1.relationship));
function stripNamespaceFromKeys(global) {
    const local = {};
    Object.keys(global).forEach(key => {
        local[key.replace("@firemodel/", "")] = global[key];
    });
    return local;
}
//# sourceMappingURL=index.js.map