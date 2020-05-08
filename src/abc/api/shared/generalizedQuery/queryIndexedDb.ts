import { IGeneralizedQuery } from "..";
import { Record } from "firemodel";
import { IFmModelConstructor, IQueryLocalResults } from "../../../../private";

export async function queryIndexedDb<T>(
  modelConstructor: IFmModelConstructor<T>,
  dexieQuery: IGeneralizedQuery<T>
) {
  // Populate Vuex with what IndexedDB knows
  const idxRecords: T[] = await dexieQuery().catch(e => {
    throw e;
  });

  const indexedDbPks = idxRecords.map(i =>
    Record.compositeKeyRef(modelConstructor, i)
  );

  const local: IQueryLocalResults<T, any> = {
    records: idxRecords,
    indexedDbPks,
    localPks: []
  }
  return local;
}