import { Model } from 'firemodel';
import { IAbcPostWatcher, IDiscreteLocalResults, IDiscreteServerResults } from '../../types';
import { AbcApi } from './AbcApi';

/**
 * Whenever the `api.get()` or `api.load()` calls return they will
 * respond with this class. The classes goal is to pass back not only
 * the result but also certain meta data and a simple means to conditionally
 * watch certain elements of the returned resultset.
 */
export class AbcResult<T extends Model> {

  constructor(private _context: AbcApi<T>, private _results: { local: IDiscreteLocalResults<T>, server?: IDiscreteServerResults<T> }) { }

  get results(): T[] {
    return [];
  }

  get cachePerformance() {
    return {
      hits: 0,
      misses: 0,
      skips: 0
    }
  }

  /**
   * Runs a callback which filters down the set of results
   * which should be watched. This list is then filtered down
   * to just those which do not currently have a watcher on them.
   * 
   * @param fn the callback function to call
   */
  watch(fn: IAbcPostWatcher<T>) {
    const watcherIds = fn(this.results);

  }
}