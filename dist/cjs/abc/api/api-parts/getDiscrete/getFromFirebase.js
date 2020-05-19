"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFromFirebase = void 0;
const private_1 = require("../../../../private");
async function getFromFirebase(ctx, requestIds) {
    const server = await private_1.serverRecords(ctx, requestIds, requestIds);
    return server;
}
exports.getFromFirebase = getFromFirebase;
//# sourceMappingURL=getFromFirebase.js.map