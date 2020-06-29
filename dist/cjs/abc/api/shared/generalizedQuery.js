"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalizedQuery = void 0;
const private_1 = require("../../../private");
const firemodel_1 = require("firemodel");
const index_1 = require("../../../shared/index");
/**
 * A generalized flow for queries; specific query helpers
 * should use this flow to standarize their approach.
 */
async function generalizedQuery(queryDefn, command, dexieQuery, firemodelQuery, ctx, options) {
    const store = private_1.getStore();
    const hasDynamicProperties = firemodel_1.Record.dynamicPathProperties(ctx.model.constructor).length > 0;
    const vuexRecords = index_1.get(store.state, ctx.vuex.fullPath.replace(/\//g, "."), []);
    const vuexPks = vuexRecords.map(v => firemodel_1.Record.compositeKeyRef(ctx.model.constructor, v));
    let local = {
        records: vuexRecords,
        vuexPks,
        indexedDbPks: [],
        localPks: vuexPks
    };
    if (command === "get" && ctx.config.useIndexedDb) {
        // Populate Vuex with what IndexedDB knows
        local = await private_1.queryIndexedDb(ctx.model.constructor, dexieQuery);
        const localResults = await private_1.AbcResult.create(ctx, {
            type: "query",
            queryDefn,
            local,
            options
        });
        if (local.records.length > 0) {
            if (hasDynamicProperties) {
                store.commit(`${ctx.vuex.moduleName}/${private_1.DbSyncOperation.ABC_INDEXED_DB_SET_DYNAMIC_PATH_VUEX}`, localResults);
            }
            else {
                store.commit(`${ctx.vuex.moduleName}/${private_1.DbSyncOperation.ABC_INDEXED_DB_SET_VUEX}`, localResults);
            }
        }
        else {
            store.commit(`${ctx.vuex.moduleName}/${private_1.AbcMutation.ABC_LOCAL_QUERY_EMPTY}`, localResults);
        }
    }
    let server;
    if (command === "get" && options.strategy === private_1.AbcStrategy.getFirebase) {
        console.log(`${ctx.model.constructor.name}:start`);
        // get data from firebase
        private_1.queryFirebase(ctx, firemodelQuery, local).then(async (server) => {
            const serverResponse = await private_1.AbcResult.create(ctx, {
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
                        case private_1.QueryType.since:
                        case private_1.QueryType.where:
                            private_1.saveToIndexedDb(server, ctx.dexieTable);
                            store.commit(`${ctx.vuex.moduleName}/${private_1.DbSyncOperation.ABC_FIREBASE_MERGE_INDEXED_DB}`, serverResponse);
                            break;
                        case private_1.QueryType.all:
                            private_1.saveToIndexedDb(server, ctx.dexieTable);
                            store.commit(`${ctx.vuex.moduleName}/${private_1.DbSyncOperation.ABC_FIREBASE_SET_DYNAMIC_PATH_INDEXED_DB}`, serverResponse);
                            break;
                    }
                }
                else {
                    private_1.saveToIndexedDb(server, ctx.dexieTable);
                    store.commit(`${ctx.vuex.moduleName}/${private_1.DbSyncOperation.ABC_FIREBASE_SET_INDEXED_DB}`, serverResponse);
                }
            }
            store.commit(`${ctx.vuex.moduleName}/${private_1.DbSyncOperation.ABC_INDEXED_DB_SET_VUEX}`, serverResponse);
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
    const response = await private_1.AbcResult.create(ctx, {
        type: "query",
        queryDefn,
        local,
        server,
        options
    });
    store.commit(`${ctx.vuex.moduleName}/${private_1.DbSyncOperation.ABC_FIREBASE_SET_VUEX}`, response);
    return response;
}
exports.generalizedQuery = generalizedQuery;
//# sourceMappingURL=generalizedQuery.js.map