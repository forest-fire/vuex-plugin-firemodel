"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firemodel_1 = require("firemodel");
const AbcApi_1 = require("../AbcApi");
const index_1 = require("../../../index");
const lodash_get_1 = __importDefault(require("lodash.get"));
/**
 * For a discrete set of primary keys, get's all knowledge of these locally. This means
 * at least Vuex but also IndexedDB if the model is configured for it.
 *
 * It returns both
 * a complete list of the primary keys found, those still missing, as well as the records
 * themselves (where Vuex representation of a record trumps the IndexedDB representation)
 */
async function localRecords(command, requestPks, options, context) {
    const idxRecords = [];
    const store = index_1.getStore();
    const vuexRecords = lodash_get_1.default(store.state, context.vuex.fullPath.replace(/\//g, "."), []);
    if (!AbcApi_1.AbcApi.indexedDbConnected) {
        await AbcApi_1.AbcApi.connectIndexedDb();
    }
    if (context.config.useIndexedDb) {
        const waitFor = [];
        requestPks.forEach(id => waitFor.push(context.dexieRecord.get(id).then(rec => {
            if (rec)
                idxRecords.push(rec);
        })));
        await Promise.all(waitFor);
    }
    const model = context.model.constructor;
    const vuexPks = vuexRecords.map(v => firemodel_1.Record.compositeKeyRef(model, v));
    const idxPks = idxRecords.map(i => firemodel_1.Record.compositeKeyRef(model, i));
    const localIds = Array.from(new Set([...vuexPks, ...idxPks]));
    const missingIds = requestPks
        .map(pk => typeof pk === "string" ? pk : firemodel_1.Record.create(model, pk).compositeKeyRef)
        .filter(pk => !localIds.includes(pk));
    const modulePostfix = context.about.modelMeta.localPostfix;
    const moduleIsList = context.about.config.isList;
    const vuexModuleName = (context.config.moduleName || moduleIsList
        ? context.about.model.plural
        : context.about.modelMeta.localModelName);
    return {
        cacheHits: localIds.length,
        cacheMisses: missingIds.length,
        foundInIndexedDb: idxPks,
        foundInVuex: vuexPks,
        foundExclusivelyInIndexedDb: idxPks.filter(i => !vuexPks.includes(i)),
        allFoundLocally: missingIds.length === 0 ? true : false,
        records: [...idxRecords, ...vuexRecords],
        missing: missingIds,
        apiCommand: command,
        modelConfig: context.config
    };
}
exports.localRecords = localRecords;
//# sourceMappingURL=localRecords.js.map