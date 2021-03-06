import { DexieRecord, IPrimaryKey, Model } from "firemodel";

import { AbcApi } from "@/abc";

export async function getFromIndexedDb<T extends Model>(
  dexieRecord: DexieRecord<T>,
  requestPks: IPrimaryKey<T>[]
) {
  if (!AbcApi.indexedDbConnected) {
    await AbcApi.connectIndexedDb();
  }

  const idxRecords: T[] = [];
  const waitFor: any[] = [];
  requestPks.forEach(id =>
    waitFor.push(
      dexieRecord.get(id).then(rec => {
        if (rec) idxRecords.push(rec);
      })
    )
  );
  await Promise.all(waitFor);
  return idxRecords;
}
