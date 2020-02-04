import { Model } from "firemodel";
import {
  IAbcPostWatcher,
  IDiscreteLocalResults,
  IDiscreteServerResults,
  IQueryServerResults,
  IQueryLocalResults,
  QueryType,
  IAbcResult
} from "../../types";
import { AbcApi } from "./AbcApi";

/**
 * Whenever the `api.get()` or `api.load()` calls return they will
 * respond with this class. The classes goal is to pass back not only
 * the result but also certain meta data and a simple means to conditionally
 * watch certain elements of the returned resultset.
 */
export class AbcResult<T extends Model> {
  constructor(private _context: AbcApi<T>, private _results: IAbcResult<T>) {}

  /**
   * All of the updated records in Vuex that originated from either IndexedDB or Firebase
   */
  get records(): T[] {
    return this.localRecords.concat(...this.serverRecords);
  }

  /**
   * All of the updated records in Vuex that originated from IndexedDB
   */
  get localRecords(): T[] {
    return this._results.local.records || [];
  }

  /**
   * All of the updated records in Vuex that originated from Firebase
   */
  get serverRecords(): T[] {
    return this._results.server ? this._results.server.records : [];
  }

  get cachePerformance() {
    return this._context.cachePerformance;
  }

  /**
   * Runs a callback which filters down the set of results
   * which should be watched. This list is then filtered down
   * to just those which do not currently have a watcher on them.
   *
   * @param fn the callback function to call
   */
  watch(fn: IAbcPostWatcher<T>) {
    // const watcherIds = fn(this.results);
  }
}
