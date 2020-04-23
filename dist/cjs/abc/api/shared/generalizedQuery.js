"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../../types");
const __1 = require("../../..");
const lodash_get_1 = __importDefault(require("lodash.get"));
const firemodel_1 = require("firemodel");
const queryIndexedDb_1 = require("./generalizedQuery/queryIndexedDb");
const queryFirebase_1 = require("./generalizedQuery/queryFirebase");
const getDiscrete_1 = require("../api-parts/getDiscrete");
/**
 * A generalized flow for queries; specific query helpers
 * should use this flow to standarize their approach.
 */
async function generalizedQuery(queryDefn, command, dexieQuery, firemodelQuery, ctx, options) {
    const t0 = performance.now();
    const store = __1.getStore();
    const hasDynamicProperties = firemodel_1.Record.dynamicPathProperties(ctx.model.constructor).length > 0;
    const vuexRecords = lodash_get_1.default(store.state, ctx.vuex.fullPath.replace(/\//g, "."), []);
    const vuexPks = vuexRecords.map(v => firemodel_1.Record.compositeKeyRef(ctx.model.constructor, v));
    let local = {
        records: vuexRecords,
        vuexPks,
        indexedDbPks: [],
        localPks: vuexPks
    };
    const t1 = performance.now();
    const perfLocal = t1 - t0;
    if (command === "get" && ctx.config.useIndexedDb) {
        // Populate Vuex with what IndexedDB knows
        local = await queryIndexedDb_1.queryIndexedDb(ctx, dexieQuery, vuexPks);
        const localResults = await __1.AbcResult.create(ctx, {
            type: "query",
            queryDefn,
            local,
            options
        }, { perfLocal });
        if (local.records.length > 0) {
            if (hasDynamicProperties) {
                store.commit(`${ctx.vuex.moduleName}/${types_1.DbSyncOperation.ABC_INDEXED_DB_SET_DYNAMIC_PATH_VUEX}`, localResults);
            }
            else {
                store.commit(`${ctx.vuex.moduleName}/${types_1.DbSyncOperation.ABC_INDEXED_DB_SET_VUEX}`, localResults);
            }
        }
        else {
            store.commit(`${ctx.vuex.moduleName}/${types_1.AbcMutation.ABC_LOCAL_QUERY_EMPTY}`, localResults);
        }
    }
    let server;
    if (command === "get" && options.strategy === types_1.AbcStrategy.getFirebase) {
        console.log(`${ctx.model.constructor.name}:start`);
        // get data from firebase
        queryFirebase_1.queryFirebase(ctx, firemodelQuery, local).then(async (server) => {
            const serverResponse = await __1.AbcResult.create(ctx, {
                type: "query",
                queryDefn,
                local,
                server,
                options
            });
            // cache results to IndexedDB
            if (ctx.config.useIndexedDb) {
                if (hasDynamicProperties) {
                    // check queryType to determine what to do
                    switch (queryDefn.queryType) {
                        case types_1.QueryType.since:
                        case types_1.QueryType.where:
                            getDiscrete_1.saveToIndexedDb(server, ctx.dexieTable);
                            store.commit(`${ctx.vuex.moduleName}/${types_1.DbSyncOperation.ABC_FIREBASE_MERGE_INDEXED_DB}`, serverResponse);
                            break;
                        case types_1.QueryType.all:
                            getDiscrete_1.saveToIndexedDb(server, ctx.dexieTable);
                            store.commit(`${ctx.vuex.moduleName}/${types_1.DbSyncOperation.ABC_FIREBASE_SET_DYNAMIC_PATH_INDEXED_DB}`, serverResponse);
                            break;
                    }
                }
                else {
                    getDiscrete_1.saveToIndexedDb(server, ctx.dexieTable);
                    store.commit(`${ctx.vuex.moduleName}/${types_1.DbSyncOperation.ABC_FIREBASE_SET_INDEXED_DB}`, serverResponse);
                }
            }
            store.commit(`${ctx.vuex.moduleName}/${types_1.DbSyncOperation.ABC_INDEXED_DB_SET_VUEX}`, serverResponse);
        });
        // PRUNE
        /* const removeFromIdx = local.indexedDbPks.filter(i => !serverPks.includes(i));
        // Vuex at this point will have both it's old state and whatever IndexedDB
        // contributed
        const removeFromVuex = local.localPks.filter(i => !serverPks.includes(i));
      
        if (removeFromVuex.length > 0) {
          store.commit(
            `${ctx.vuex.moduleName}/${AbcMutation.ABC_PRUNE_STALE_VUEX_RECORDS}`,
            { pks: removeFromVuex, vuex: ctx.vuex }
          );
        }
    
        if (removeFromIdx.length > 0) {
          await ctx.dexieTable.bulkDelete(removeFromIdx);
          store.commit(
            `${ctx.vuex.moduleName}/${AbcMutation.ABC_PRUNE_STALE_IDX_RECORDS}`,
            { pks: removeFromIdx, vuex: ctx.vuex }
          );
        }
      
        server = {
          ...server,
          removeFromIdx,
          removeFromVuex
        }; */
    }
    const t2 = performance.now();
    const perfServer = t2 - t1;
    const response = await __1.AbcResult.create(ctx, {
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