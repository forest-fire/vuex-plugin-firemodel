import { IGeneralizedQuery } from "..";
import { Record } from "firemodel";
import { AbcApi } from "../..";
import { IQueryLocalResults } from "../../../..";

export async function queryIndexedDb<T>(
  ctx: AbcApi<T>,
  dexieQuery: IGeneralizedQuery<T>,
  vuexPks: string[]
) {
  // Populate Vuex with what IndexedDB knows
  const idxRecords: T[] = await dexieQuery().catch(e => {
    throw e;
  });

  const indexedDbPks = idxRecords.map(i =>
    Record.compositeKeyRef(ctx.model.constructor, i)
  );

  const local: IQueryLocalResults<T, any> = {
    records: idxRecords,
    vuexPks,
    indexedDbPks,
    localPks: Array.from(new Set(vuexPks.concat(...indexedDbPks)))
  }
  return local;
}