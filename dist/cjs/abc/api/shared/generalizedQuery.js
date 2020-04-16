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
            store.commit(`${ctx.vuex.moduleName}/${types_1.AbcMutation.ABC_LOCAL_QUERY_TO_VUEX}`, localResults);
        }
        else {
            store.commit(`${ctx.vuex.moduleName}/${types_1.AbcMutation.ABC_LOCAL_QUERY_EMPTY}`, localResults);
        }
    }
    let server;
    if (command === "get" && options.strategy === types_1.AbcStrategy.getFirebase) {
        // get data from firebase
        queryFirebase_1.queryFirebase(ctx, firemodelQuery, local).then(server => {
            // cache results to IndexedDB
            if (ctx.config.useIndexedDb) {
                getDiscrete_1.saveToIndexedDb(server, ctx.dexieTable);
                if (queryDefn.queryType === types_1.QueryType.all) {
                    const hasDynamicProperties = firemodel_1.Record.dynamicPathProperties(ctx.model.constructor).length > 0;
                    // check if with dynamic path
                    if (hasDynamicProperties) {
                        /* store.commit(
                          `${ctx.vuex.moduleName}/${DbSyncOperation.ABC_FIREBASE_SET_DYNAMIC_PATH_INDEXED_DB}`,
                          server.records
                        ); */
                    }
                    else {
                        // else do a set
                        store.commit(`${ctx.vuex.moduleName}/${types_1.DbSyncOperation.ABC_FIREBASE_SET_INDEXED_DB}`, server.records);
                    }
                }
            }
            // SET
            // SET_DYNAMIC_PATH
            // MERGE (Firebase wins)
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