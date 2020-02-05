import {
  IAbcAllQueryDefinition,
  AbcRequestCommand,
  AbcMutation,
  IQueryLocalResults,
  IQueryServerResults,
  QueryType,
  IAbcQueryDefinition,
  IAbcOptions
} from "../../../types";
import { AbcApi } from "../AbcApi";
import { getStore, AbcResult, IQueryOptions } from "../../..";
import get = require("lodash.get");
import { Record, List, IListOptions } from "firemodel";
import { deepEqual } from "fast-equals";
import { findPk } from "../shared/findPk";
import { localRecords } from "../api-parts/localRecords";

export interface IGeneralizedQuery<T> {
  (): Promise<T[]>;
}

/**
 * A generalized flow for queries; specific query helpers
 * should use this flow to standarize their approach.
 */
export async function generalizedQuery<T>(
  queryDefn: IAbcQueryDefinition<T>,
  command: AbcRequestCommand,
  dexieQuery: IGeneralizedQuery<T>,
  firemodelQuery: IGeneralizedQuery<T>,
  ctx: AbcApi<T>,
  options: IAbcOptions<T>
) {
  const store = getStore();
  const vuexRecords = get<T[]>(
    store.state,
    ctx.vuex.fullPath.replace(/\//g, "."),
    []
  );
  const vuexPks = vuexRecords.map(v =>
    Record.compositeKeyRef(ctx.model.constructor, v)
  );

  let idxRecords: T[] = [];
  let local: IQueryLocalResults<T, any>;

  if (command === "get" && ctx.config.useIndexedDb) {
    // Populate Vuex with what IndexedDB knows
    idxRecords = await dexieQuery();

    const indexedDbPks = idxRecords.map(i =>
      Record.compositeKeyRef(ctx.model.constructor, i)
    );
    local = {
      records: idxRecords,
      vuexPks,
      indexedDbPks,
      localPks: Array.from(new Set(vuexPks.concat(...indexedDbPks)))
    };
    const localResults = new AbcResult(ctx, {
      type: "query",
      queryDefn,
      local,
      options
    });

    if (idxRecords.length > 0) {
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
  } else {
    local = {
      records: vuexRecords,
      vuexPks,
      indexedDbPks: [],
      localPks: vuexPks
    } as IQueryLocalResults<T>;
  }

  const serverRecords = await firemodelQuery();
  const serverPks = serverRecords.map(i =>
    Record.compositeKeyRef(ctx.model.constructor, i)
  );
  const newPks = serverPks.filter(i => !local.localPks.includes(i));
  const cacheHits: string[] = [];
  const stalePks: string[] = [];
  serverRecords.forEach(rec => {
    const pk = Record.compositeKeyRef(ctx.model.constructor, rec);
    if (!newPks.includes(pk)) {
      const localRec = findPk(pk, local.records);
      if (deepEqual(rec, localRec)) {
        cacheHits.push(pk);
      } else {
        stalePks.push(pk);
      }
    }
  });

  ctx.cachePerformance.hits = ctx.cachePerformance.hits + cacheHits.length;
  ctx.cachePerformance.misses =
    ctx.cachePerformance.misses + stalePks.length + newPks.length;

  const server: IQueryServerResults<T> = {
    records: serverRecords,
    serverPks,
    newPks,
    cacheHits,
    stalePks,
    overallCachePerformance: ctx.cachePerformance
  };

  // PRUNE
  const removeFromIdx = local.indexedDbPks.filter(i => !serverPks.includes(i));
  const removeFromVuex = local.vuexPks.filter(i => !serverPks.includes(i));

  store.commit(
    `${ctx.vuex.moduleName}/${AbcMutation.ABC_PRUNE_STALE_VUEX_RECORDS}`,
    { pks: removeFromVuex, vuex: ctx.vuex }
  );
  ctx.dexieTable.bulkDelete(stalePks).then(() => {
    // NOTE: this is making the async component (which will be short) not part of the
    // critical path for this query's completion. This is intended.
    store.commit(
      `${ctx.vuex.moduleName}/${AbcMutation.ABC_PRUNE_STALE_IDX_RECORDS}`,
      { pks: removeFromIdx, vuex: ctx.vuex }
    );
  });

  const response = new AbcResult(ctx, {
    type: "query",
    queryDefn,
    local,
    server,
    options
  });

  store.commit(
    `${ctx.vuex.moduleName}/${AbcMutation.ABC_FIREBASE_TO_VUEX_UPDATE}`,
    response
  );

  return response;
}
