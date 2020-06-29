import { AbcApi, findPk } from "@/abc";
import {
  IGeneralizedFiremodelQuery,
  IQueryLocalResults,
  IQueryServerResults
} from "@/types";
import { Model, Record } from "firemodel";

import { deepEqual } from "fast-equals";

/**
 * Queries Firebase with a query passed in `generalizedQuery` workflow function
 * which manages both local dexie queries along with firebase queries. This function
 * is to manage the Firebase aspects of the workflow.
 *
 * @param ctx the ABC API
 * @param firemodelQuery the query which will be run against Firebase
 * @param local results that came from the dexie query
 */
export async function queryFirebase<T extends Model>(
  ctx: AbcApi<T>,
  firemodelQuery: IGeneralizedFiremodelQuery<T>,
  local: IQueryLocalResults<T, any>
) {
  // get data from firebase
  const cacheHits: string[] = [];
  const stalePks: string[] = [];
  const { data: serverRecords, query } = await firemodelQuery();
  const serverPks = serverRecords.map(i =>
    Record.compositeKeyRef(ctx.model.constructor, i)
  );
  const newPks = serverPks.filter(i => local.localPks.includes(i));
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

  const removeFromIdx = local.indexedDbPks.filter(i => !serverPks.includes(i));
  /**
   * Vuex at this point will have both it's old state and whatever IndexedDB
   * contributed
   */
  const removeFromVuex = local.localPks.filter(i => !serverPks.includes(i));

  const server: IQueryServerResults<T> = {
    records: serverRecords,
    serverPks,
    newPks,
    cacheHits,
    stalePks,
    query,
    removeFromIdx,
    removeFromVuex,
    overallCachePerformance: ctx.cachePerformance
  };

  return server;
}
