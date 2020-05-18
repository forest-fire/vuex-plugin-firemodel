import { Model } from "firemodel";
import { IAbcPostWatcher, IAbcResult } from "../../types";
import { AbcApi } from "./AbcApi";
import { IDictionary } from "common-types";
/**
 * Whenever the `api.get()` or `api.load()` calls return they will
 * respond with this class. The classes goal is to pass back not only
 * the result but also certain meta data and a simple means to conditionally
 * watch certain elements of the returned resultset.
 */
export declare class AbcResult<T extends Model> {
    private _context;
    private _results;
    private _performance?;
    constructor(_context: AbcApi<T>, _results: IAbcResult<T>, _performance?: IDictionary<any> | undefined);
    static create<T extends Model>(_context: AbcApi<T>, _results: IAbcResult<T>, _performance?: IDictionary): Promise<AbcResult<T>>;
    /**
     * All of the updated records in Vuex that originated from either IndexedDB or Firebase
     */
    records: T[];
    /**
     * Boolean flag to indicate that the result came from a query (instead of a discrete request)
     */
    get resultFromQuery(): boolean;
    /**
     * All of the updated records in Vuex that originated from IndexedDB
     */
    get localRecords(): T[];
    /**
     * All of the updated records in Vuex that originated from Firebase
     */
    get serverRecords(): T[] | undefined;
    get cachePerformance(): {
        hits: number;
        misses: number;
        ignores: number;
    };
    get requestPerformance(): IDictionary<any> | undefined;
    get vuex(): {
        isList: boolean | undefined;
        modulePath: string;
        moduleName: string;
        modulePostfix: string;
        fullPath: string;
    };
    /**
     * The options passed in for the specific request which led to this result
     */
    get options(): import("../../types").IDiscreteOptions<T> | import("../../types").IQueryOptions<T>;
    /** the query definition used to arrive at these results */
    get queryDefn(): import("../../types").IAbcQueryDefinition<T>;
    /**
     * Runs a callback which filters down the set of results
     * which should be watched. This list is then filtered down
     * to just those which do not currently have a watcher on them.
     *
     * @param fn the callback function to call
     */
    watch(fn: IAbcPostWatcher<T>): void;
}
