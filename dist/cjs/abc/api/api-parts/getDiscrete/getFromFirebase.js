"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFromFirebase = void 0;
const shared_1 = require("../../shared");
async function getFromFirebase(ctx, requestIds) {
    const server = await shared_1.serverRecords(ctx, requestIds, requestIds);
    return server;
}
exports.getFromFirebase = getFromFirebase;
//# sourceMappingURL=getFromFirebase.js.map