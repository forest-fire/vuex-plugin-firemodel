import { IDiscreteServerResults } from "../../../..";
import { Model, IPrimaryKey } from "firemodel";
import Dexie from "dexie";

export function saveToIndexedDB<T extends Model>(
  server: IDiscreteServerResults<T>,
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