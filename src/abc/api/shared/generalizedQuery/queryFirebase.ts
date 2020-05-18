import { AbcApi, IQueryLocalResults, IQueryServerResults } from "../../../../private";
import { IGeneralizedQuery, findPk } from "..";
import { Record, Model } from "firemodel";
import { deepEqual } from "fast-equals";

export async function queryFirebase<T extends Model>(
  ctx: AbcApi<T>,
  firemodelQuery: IGeneralizedQuery<T>,
  local: IQueryLocalResults<T, any>
) {
  // get data from firebase
  const cacheHits: string[] = [];
  const stalePks: string[] = [];
  const serverRecords = await firemodelQuery();
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
  ctx.cachePerformance.misses = ctx.cachePerformance.misses + stalePks.length + newPks.length;
  
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
    removeFromIdx,
    removeFromVuex,
    overallCachePerformance: ctx.cachePerformance
  };

  return server
}