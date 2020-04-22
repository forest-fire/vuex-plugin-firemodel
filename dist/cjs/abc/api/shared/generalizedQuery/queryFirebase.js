"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const firemodel_1 = require("firemodel");
const fast_equals_1 = require("fast-equals");
async function queryFirebase(ctx, firemodelQuery, local) {
    // get data from firebase
    const cacheHits = [];
    const stalePks = [];
    const serverRecords = await firemodelQuery();
    const serverPks = serverRecords.map(i => firemodel_1.Record.compositeKeyRef(ctx.model.constructor, i));
    const newPks = serverPks.filter(i => !local.localPks.includes(i));
    serverRecords.forEach(rec => {
        const pk = firemodel_1.Record.compositeKeyRef(ctx.model.constructor, rec);
        if (!newPks.includes(pk)) {
            const localRec = __1.findPk(pk, local.records);
            if (fast_equals_1.deepEqual(rec, localRec)) {
                cacheHits.push(pk);
            }
            else {
                stalePks.push(pk);
            }
        }
    });
    ctx.cachePerformance.hits = ctx.cachePerformance.hits + cacheHits.length;
    ctx.cachePerformance.misses = ctx.cachePerformance.misses + stalePks.length + newPks.length;
    const server = {
        records: serverRecords,
        serverPks,
        newPks,
        cacheHits,
        stalePks,
        removeFromIdx: [],
        removeFromVuex: [],
        overallCachePerformance: ctx.cachePerformance
    };
    return server;
}
exports.queryFirebase = queryFirebase;
//# sourceMappingURL=queryFirebase.js.map