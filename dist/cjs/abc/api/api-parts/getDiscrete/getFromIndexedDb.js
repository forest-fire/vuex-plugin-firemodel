"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFromIndexedDb = void 0;
const private_1 = require("../../../../private");
async function getFromIndexedDb(dexieRecord, requestPks) {
    if (!private_1.AbcApi.indexedDbConnected) {
        await private_1.AbcApi.connectIndexedDb();
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