import { IServerResults } from "@/types";
import { IPrimaryKey, Model } from "firemodel";

import Dexie from "dexie";
import { AbcResult } from "../../AbcResult";

export function saveToIndexedDb<T extends Model>(
  server: AbcResult<T>,
  dexieTable: Dexie.Table<T, IPrimaryKey<T>>
) {
  const waitFor: any[] = [];
  const now = new Date().getTime();
  server.records.forEach(record => {
    const newRec = {
      ...record,
      lastUpdated: now,
      createdAt: record.createdAt || now
    };
    waitFor.push(dexieTable.put(newRec));
  });
  const results = Promise.all(waitFor);
  return results;
}
