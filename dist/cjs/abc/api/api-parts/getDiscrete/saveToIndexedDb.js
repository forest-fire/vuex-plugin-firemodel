"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function saveToIndexedDB(server, dexieTable) {
    const waitFor = [];
    const now = new Date().getTime();
    server.records.forEach(record => {
        const newRec = Object.assign(Object.assign({}, record), { lastUpdated: now, createdAt: record.createdAt || now });
        waitFor.push(dexieTable.put(newRec));
    });
    const results = Promise.all(waitFor);
    return results;
}
exports.saveToIndexedDB = saveToIndexedDB;
//# sourceMappingURL=saveToIndexedDb.js.map