import {
  AbcRequestCommand,
  AbcMutation,
  IQueryLocalResults,
  IQueryServerResults,
  IAbcQueryDefinition,
  IAbcOptions,
  AbcStrategy,
  QueryType,
  DbSyncOperation
} from "../../../types";
import { AbcApi } from "../AbcApi";
import { getStore, AbcResult } from "../../..";
import get from "lodash.get";
import { Record, Model } from "firemodel";
import { deepEqual } from "fast-equals";
import { findPk } from "../shared/findPk";
import { queryIndexedDb } from "./generalizedQuery/queryIndexedDb";
import { queryFirebase } from "./generalizedQuery/queryFirebase";
import { saveToIndexedDb } from "../api-parts/getDiscrete";

export interface IGeneralizedQuery<T extends Model> {
  (): Promise<T[]>;
}

/**
 * A generalized flow for queries; specific query helpers
 * should use this flow to standarize their approach.
 */
export async function generalizedQuery<T extends Model>(
  queryDefn: IAbcQueryDefinition<T>,
  command: AbcRequestCommand,
  dexieQuery: IGeneralizedQuery<T>,
  firemodelQuery: IGeneralizedQuery<T>,
  ctx: AbcApi<T>,
  options: IAbcOptions<T>
) {
  const t0 = performance.now();
  const store = getStore();
  const vuexRecords = get<T[]>(
    store.state,
    ctx.vuex.fullPath.replace(/\//g, "."),
    []
  );
  const vuexPks = vuexRecords.map(v =>
    Record.compositeKeyRef(ctx.model.constructor, v)
  );

  let local: IQueryLocalResults<T, any> = {
    records: vuexRecords,
    vuexPks,
    indexedDbPks: [],
    localPks: vuexPks
  };

  const t1 = performance.now();
  const perfLocal = t1 - t0;
  if (command === "get" && ctx.config.useIndexedDb) {
    // Populate Vuex with what IndexedDB knows
    local = await queryIndexedDb(ctx, dexieQuery, vuexPks)
    const localResults = await AbcResult.create(ctx, {
      type: "query",
      queryDefn,
      local,
      options
    }, { perfLocal });

    if (local.records.length > 0) {
      store.commit(
        `${ctx.vuex.moduleName}/${AbcMutation.ABC_LOCAL_QUERY_TO_VUEX}`,
        localResults
      );
    } else {
      store.commit(
        `${ctx.vuex.moduleName}/${AbcMutation.ABC_LOCAL_QUERY_EMPTY}`,
        localResults
      );
    }
  }

  let server: IQueryServerResults<T> | undefined;
  if (command === "get" && options.strategy === AbcStrategy.getFirebase) {
    // get data from firebase
    queryFirebase(ctx, firemodelQuery, local).then(server => {
      // cache results to IndexedDB
      if (ctx.config.useIndexedDb) {
        saveToIndexedDb(server, ctx.dexieTable);

        if (queryDefn.queryType === QueryType.all) {
          const hasDynamicProperties = Record.dynamicPathProperties(ctx.model.constructor).length > 0;
          // check if with dynamic path
          if (hasDynamicProperties) {
            /* store.commit(
              `${ctx.vuex.moduleName}/${DbSyncOperation.ABC_FIREBASE_SET_DYNAMIC_PATH_INDEXED_DB}`,
              server.records
            ); */
          } else {
            // else do a set
            store.commit(
              `${ctx.vuex.moduleName}/${DbSyncOperation.ABC_FIREBASE_SET_INDEXED_DB}`,
              server.records
            );
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
  const response = new AbcResult(ctx, {
    type: "query",
    queryDefn,
    local,
    server,
    options
  }, { perfLocal, perfServer });

  store.commit(
    `${ctx.vuex.moduleName}/${AbcMutation.ABC_FIREBASE_TO_VUEX_UPDATE}`,
    response
  );

  return response;
}
