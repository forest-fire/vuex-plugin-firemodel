import "./fake-indexeddb";
import indexedDB from "fake-indexeddb";
import fdbKeyRange from "fake-indexeddb/lib/FDBKeyRange";
import { DexieDb } from "firemodel";

/**
 * tell DexieDb to use a _fake_ in memory version if
 * IndexedDB.
 */
export const fakeIndexedDb = async () => {
  DexieDb.indexedDB(indexedDB, fdbKeyRange);
};
