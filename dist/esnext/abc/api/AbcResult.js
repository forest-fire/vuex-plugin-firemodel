import { Record } from "firemodel";
import { arrayToHash, hashToArray } from "typed-conversions";
import { AbcError } from "../../errors";
/**
 * Whenever the `api.get()` or `api.load()` calls return they will
 * respond with this class. The classes goal is to pass back not only
 * the result but also certain meta data and a simple means to conditionally
 * watch certain elements of the returned resultset.
 */
export class AbcResult {
    constructor(_context, _results, _performance) {
        this._context = _context;
        this._results = _results;
        this._performance = _performance;
    }
    /**
     * All of the updated records in Vuex that originated from either IndexedDB or Firebase
     */
    get records() {
        if (!this.options.mergeRecords) {
            // Models without dynamic paths
            return this.serverRecords.length > 0
                ? this.serverRecords
                : this.localRecords;
        }
        else {
            // Models with dynamic paths
            let localPathProps = Record.compositeKey(this._context.model.constructor, this.serverRecords[0]);
            delete localPathProps.id;
            const where = Object.keys(localPathProps).reduce((agg, curr) => {
                const value = typeof localPathProps[curr] === 'string' ? `"${localPathProps[curr]}"` : localPathProps[curr];
                agg.push(`${curr} != ${value}`);
                return agg;
            }, []).join(' AND ');
            // select *  WHERE x!= v1 AND y !=v2
            const localOffDynamicPath = {}; // arrayToHash( this._context.dexieTable.where(where).  );
            //TODO: add the right Dexie query
            const server = arrayToHash(this.serverRecords);
            return hashToArray(Object.assign(Object.assign({}, localOffDynamicPath), server));
        }
    }
    /**
     * All of the updated records in Vuex that originated from IndexedDB
     */
    get localRecords() {
        var _a;
        return ((_a = this._results.local) === null || _a === void 0 ? void 0 : _a.records) || [];
    }
    /**
     * All of the updated records in Vuex that originated from Firebase
     */
    get serverRecords() {
        return this._results.server ? this._results.server.records : [];
    }
    get cachePerformance() {
        return this._context.cachePerformance;
    }
    get requestPerformance() {
        return this._performance;
    }
    get vuex() {
        return this._context.vuex;
    }
    /**
     * The options passed in for the specific request which led to this result
     */
    get options() {
        return this._results.options;
    }
    /** the query definition used to arrive at these results */
    get queryDefn() {
        if (this._results.type !== "query") {
            throw new AbcError(`The attempt to reference the result's "queryDefn" is invalid in non-query based results!`, "not-allowed");
        }
        return this._results.queryDefn;
    }
    /**
     * Runs a callback which filters down the set of results
     * which should be watched. This list is then filtered down
     * to just those which do not currently have a watcher on them.
     *
     * @param fn the callback function to call
     */
    watch(fn) {
        // const watcherIds = fn(this.results);
    }
}
