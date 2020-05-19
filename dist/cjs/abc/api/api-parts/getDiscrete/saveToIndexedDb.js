"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveToIndexedDb = void 0;
function saveToIndexedDb(server, dexieTable) {
    const waitFor = [];
    const now = new Date().getTime();
    server.records.forEach(record => {
        const newRec = Object.assign(Object.assign({}, record), { lastUpdated: now, createdAt: record.createdAt || now });
        waitFor.push(dexieTable.put(newRec));
    });
    const results = Promise.all(waitFor);
    return results;
}
exports.saveToIndexedDb = saveToIndexedDb;
//# sourceMappingURL=saveToIndexedDb.js.map