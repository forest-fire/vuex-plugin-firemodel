"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../..");
async function getFromIndexedDb(dexieRecord, requestPks) {
    if (!__1.AbcApi.indexedDbConnected) {
        await __1.AbcApi.connectIndexedDb();
    }
    const idxRecords = [];
    const waitFor = [];
    requestPks.forEach(id => waitFor.push(dexieRecord.get(id).then(rec => {
        if (rec)
            idxRecords.push(rec);
    })));
    await Promise.all(waitFor);
    return idxRecords;
}
exports.getFromIndexedDb = getFromIndexedDb;
//# sourceMappingURL=getFromIndexedDb.js.map