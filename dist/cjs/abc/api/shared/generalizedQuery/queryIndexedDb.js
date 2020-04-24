"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firemodel_1 = require("firemodel");
async function queryIndexedDb(ctx, dexieQuery, vuexPks) {
    // Populate Vuex with what IndexedDB knows
    const idxRecords = await dexieQuery().catch(e => {
        throw e;
    });
    const indexedDbPks = idxRecords.map(i => firemodel_1.Record.compositeKeyRef(ctx.model.constructor, i));
    const local = {
        records: idxRecords,
        vuexPks,
        indexedDbPks,
        localPks: Array.from(new Set(vuexPks.concat(...indexedDbPks)))
    };
    return local;
}
exports.queryIndexedDb = queryIndexedDb;
//# sourceMappingURL=queryIndexedDb.js.map