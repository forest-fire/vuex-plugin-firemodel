import { AbcApi } from "../AbcApi";
import { IDictionary } from "common-types";
import { Model } from "firemodel";

/**
 * **since**
 * 
 * Gets all records _since_ a certain timestamp (`epoch` with milliseconds)
 */
let since = function since<T extends Model = IDictionary>(timestamp: number) {
  return <T>(command: 'get' | 'load', context: AbcApi<T>): Promise<T[]> => {
    // if indexedDB, get from IndexedDb
    // 

    return Promise.resolve([]);
  }

}

since.prototype.isQueryHelper = true;

export { since }
