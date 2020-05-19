"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeLocalRecords = void 0;
const firemodel_1 = require("firemodel");
const typed_conversions_1 = require("typed-conversions");
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
        records: typed_conversions_1.hashToArray(Object.assign(Object.assign({}, typed_conversions_1.arrayToHash(vuexRecords)), typed_conversions_1.arrayToHash(idxRecords))),
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