"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.determineLocalStateNode = void 0;
const common_types_1 = require("common-types");
/**
 * **pathToState**
 *
 * Takes a **Firemodel** server event and determines the
 * appropriate path to the local state node.
 */
function determineLocalStateNode(payload, mutation) {
    return common_types_1.pathJoin((payload.localPath || "").replace(`/${payload.localPostfix}`, ""), mutation);
}
exports.determineLocalStateNode = determineLocalStateNode;
//# sourceMappingURL=determineLocalStateNode.js.map