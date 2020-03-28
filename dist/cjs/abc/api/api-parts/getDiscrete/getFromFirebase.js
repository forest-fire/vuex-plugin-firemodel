"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../..");
const shared_1 = require("../../shared");
async function getFromFirebase(ctx, local, options = {}, requestIds) {
    const server = await shared_1.serverRecords(ctx, requestIds, requestIds);
    const serverResults = new __1.AbcResult(ctx, {
        type: "discrete",
        local,
        server,
        options
    }, {});
    return { server, serverResults };
}
exports.getFromFirebase = getFromFirebase;
//# sourceMappingURL=getFromFirebase.js.map