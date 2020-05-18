"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverRecords = void 0;
const firemodel_1 = require("firemodel");
async function serverRecords(context, pks, allPks) {
    const records = (await firemodel_1.List.ids(context.model.constructor, ...pks)).data;
    const recordIds = records.map(i => firemodel_1.Record.compositeKeyRef(context.model.constructor, i));
    const missing = pks.filter(i => !recordIds.includes(i));
    return {
        pks,
        allPks,
        missing,
        records,
        overallCachePerformance: context.cachePerformance,
        modelConfig: context.config
    };
}
exports.serverRecords = serverRecords;
//# sourceMappingURL=serverRecords.js.map