import { Model } from 'firemodel';
import { IAbcPostWatcher } from '../../types';
/**
 * Whenever the `api.get()` or `api.load()` calls return they will
 * respond with this class. The classes goal is to pass back not only
 * the result but also certain meta data and a simple means to conditionally
 * watch certain elements of the returned resultset.
 */
export declare class AbcResult<T extends Model> {
    get results(): T[];
    get cachePerformance(): {
        hits: number;
        misses: number;
        skips: number;
    };
    /**
     * Runs a callback which filters down the set of results
     * which should be watched. This list is then filtered down
     * to just those which do not currently have a watcher on them.
     *
     * @param fn the callback function to call
     */
    watch(fn: IAbcPostWatcher<T>): void;
}
