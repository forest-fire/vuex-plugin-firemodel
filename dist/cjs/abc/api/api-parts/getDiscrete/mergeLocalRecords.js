"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firemodel_1 = require("firemodel");
function mergeLocalRecords(context, idxRecords, vuexRecords, requestPks) {
    const model = context.model.constructor;
    const vuexPks = vuexRecords.map(v => firemodel_1.Record.compositeKeyRef(model, v));
    const idxPks = idxRecords.map(i => firemodel_1.Record.compositeKeyRef(model, i));
    const localIds = Array.from(new Set([...vuexPks, ...idxPks]));
    const missingIds = requestPks
        .map(pk => typeof pk === "string" ? pk : firemodel_1.Record.create(model, pk).compositeKeyRef)
        .filter(pk => !localIds.includes(pk));
    const results = {
        cacheHits: localIds.length,
        cacheMisses: missingIds.length,
        foundInIndexedDb: idxPks,
        foundInVuex: vuexPks,
        foundExclusivelyInIndexedDb: idxPks.filter(i => !vuexPks.includes(i)),
        allFoundLocally: missingIds.length === 0 ? true : false,
        records: Object.assign(Object.assign({}, vuexRecords), idxRecords),
        missing: missingIds,
        modelConfig: context.config
    };
    let local = undefined;
    if (results) {
        context.cacheHits(results.cacheHits);
        context.cacheMisses(results.cacheMisses);
        local = Object.assign(Object.assign({}, results), { overallCachePerformance: context.cachePerformance });
    }
    return local;
}
exports.mergeLocalRecords = mergeLocalRecords;
//# sourceMappingURL=mergeLocalRecords.js.map