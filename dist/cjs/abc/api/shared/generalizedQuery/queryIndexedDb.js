"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryIndexedDb = void 0;
const firemodel_1 = require("firemodel");
async function queryIndexedDb(modelConstructor, dexieQuery) {
    // Populate Vuex with what IndexedDB knows
    const idxRecords = await dexieQuery().catch(e => {
        throw e;
    });
    const indexedDbPks = idxRecords.map(i => firemodel_1.Record.compositeKeyRef(modelConstructor, i));
    const local = {
        records: idxRecords,
        indexedDbPks,
        localPks: []
    };
    return local;
}
exports.queryIndexedDb = queryIndexedDb;
//# sourceMappingURL=queryIndexedDb.js.map