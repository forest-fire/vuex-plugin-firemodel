"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../../types");
const __1 = require("../../..");
const lodash_get_1 = __importDefault(require("lodash.get"));
const firemodel_1 = require("firemodel");
const fast_equals_1 = require("fast-equals");
const findPk_1 = require("../shared/findPk");
/**
 * A generalized flow for queries; specific query helpers
 * should use this flow to standarize their approach.
 */
async function generalizedQuery(queryDefn, command, dexieQuery, firemodelQuery, ctx, options) {
    const t0 = performance.now();
    const store = __1.getStore();
    const vuexRecords = lodash_get_1.default(store.state, ctx.vuex.fullPath.replace(/\//g, "."), []);
    const vuexPks = vuexRecords.map(v => firemodel_1.Record.compositeKeyRef(ctx.model.constructor, v));
    let idxRecords = [];
    let local;
    const t1 = performance.now();
    const perfLocal = t1 - t0;
    if (command === "get" && ctx.config.useIndexedDb) {
        // Populate Vuex with what IndexedDB knows
        idxRecords = await dexieQuery().catch(e => {
            throw e;
        });
        const indexedDbPks = idxRecords.map(i => firemodel_1.Record.compositeKeyRef(ctx.model.constructor, i));
        local = {
            records: idxRecords,
            vuexPks,
            indexedDbPks,
            localPks: Array.from(new Set(vuexPks.concat(...indexedDbPks)))
        };
        const localResults = new __1.AbcResult(ctx, {
            type: "query",
            queryDefn,
            local,
            options
        }, { perfLocal });
        if (idxRecords.length > 0) {
            store.commit(`${ctx.vuex.moduleName}/${types_1.AbcMutation.ABC_LOCAL_QUERY_TO_VUEX}`, localResults);
        }
        else {
            store.commit(`${ctx.vuex.moduleName}/${types_1.AbcMutation.ABC_LOCAL_QUERY_EMPTY}`, localResults);
        }
    }
    else {
        local = {
            records: vuexRecords,
            vuexPks,
            indexedDbPks: [],
            localPks: vuexPks
        };
    }
    const serverRecords = await firemodelQuery();
    const serverPks = serverRecords.map(i => firemodel_1.Record.compositeKeyRef(ctx.model.constructor, i));
    const newPks = serverPks.filter(i => !local.localPks.includes(i));
    const cacheHits = [];
    const stalePks = [];
    const waitFor = [];
    const now = new Date().getTime();
    try {
        serverRecords.forEach(rec => {
            const newRec = Object.assign(Object.assign({}, rec), { lastUpdated: now, createdAt: rec.createdAt || now });
            waitFor.push(ctx.dexieTable.put(newRec));
            const pk = firemodel_1.Record.compositeKeyRef(ctx.model.constructor, rec);
            if (!newPks.includes(pk)) {
                const localRec = findPk_1.findPk(pk, local.records);
                if (fast_equals_1.deepEqual(rec, localRec)) {
                    cacheHits.push(pk);
                }
                else {
                    stalePks.push(pk);
                }
            }
        });
        // cache results to IndexedDB
        if (ctx.config.useIndexedDb) {
            await Promise.all(waitFor);
            store.commit(`${ctx.vuex.moduleName}/${types_1.AbcMutation.ABC_FIREBASE_REFRESH_INDEXED_DB}`, serverRecords);
        }
    }
    catch (e) {
        // cache results to IndexedDB
        if (ctx.config.useIndexedDb) {
            store.commit(`${ctx.vuex.moduleName}/${types_1.AbcMutation.ABC_INDEXED_DB_REFRESH_FAILED}`, Object.assign(Object.assign({}, serverRecords), { errorMessage: e.message, errorStack: e.stack }));
        }
    }
    ctx.cachePerformance.hits = ctx.cachePerformance.hits + cacheHits.length;
    ctx.cachePerformance.misses =
        ctx.cachePerformance.misses + stalePks.length + newPks.length;
    // PRUNE
    const removeFromIdx = local.indexedDbPks.filter(i => !serverPks.includes(i));
    // Vuex at this point will have both it's old state and whatever IndexedDB
    // contributed
    const removeFromVuex = local.localPks.filter(i => !serverPks.includes(i));
    console.log({ removeFromIdx, removeFromVuex });
    if (removeFromVuex.length > 0) {
        store.commit(`${ctx.vuex.moduleName}/${types_1.AbcMutation.ABC_PRUNE_STALE_VUEX_RECORDS}`, { pks: removeFromVuex, vuex: ctx.vuex });
    }
    if (removeFromIdx.length > 0) {
        await ctx.dexieTable.bulkDelete(removeFromIdx);
        store.commit(`${ctx.vuex.moduleName}/${types_1.AbcMutation.ABC_PRUNE_STALE_IDX_RECORDS}`, { pks: removeFromIdx, vuex: ctx.vuex });
    }
    const server = {
        records: serverRecords,
        serverPks,
        newPks,
        cacheHits,
        stalePks,
        removeFromIdx,
        removeFromVuex,
        overallCachePerformance: ctx.cachePerformance
    };
    const t2 = performance.now();
    const perfServer = t2 - t1;
    const response = new __1.AbcResult(ctx, {
        type: "query",
        queryDefn,
        local,
        server,
        options
    }, { perfLocal, perfServer });
    store.commit(`${ctx.vuex.moduleName}/${types_1.AbcMutation.ABC_FIREBASE_TO_VUEX_UPDATE}`, response);
    return response;
}
exports.generalizedQuery = generalizedQuery;
//# sourceMappingURL=generalizedQuery.js.map