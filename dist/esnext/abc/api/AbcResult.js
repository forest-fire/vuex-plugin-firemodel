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
        /**
         * All of the updated records in Vuex that originated from either IndexedDB or Firebase
         */
        this.records = [];
    }
    static async create(_context, _results, _performance) {
        const obj = new AbcResult(_context, _results, _performance);
        if (obj.serverRecords === undefined) {
            obj.records = obj.localRecords;
            return obj;
        }
        // Models with dynamic paths
        const hasDynamicProperties = Record.dynamicPathProperties(obj._context.model.constructor).length > 0;
        if (hasDynamicProperties) {
            let localPathProps = Record.compositeKey(obj._context.model.constructor, obj.serverRecords[0]);
            delete localPathProps.id;
            const propKeys = Object.keys(localPathProps);
            const propValues = Object.values(localPathProps);
            const whereClause = propKeys.length > 1 ? propKeys : propKeys.toString();
            const notEqualVal = propValues.length > 1 ? propValues : propValues.toString();
            const queryResults = await obj._context.dexieTable.where(whereClause)
                .notEqual(notEqualVal).toArray();
            const localOffDynamicPath = arrayToHash(queryResults);
            const server = arrayToHash(obj.serverRecords || []);
            obj.records = hashToArray(Object.assign(Object.assign({}, localOffDynamicPath), server));
        }
        else {
            obj.records = obj.serverRecords !== undefined
                ? obj.serverRecords
                : obj.localRecords;
        }
        return obj;
    }
    /**
     * Boolean flag to indicate that the result came from a query (instead of a discrete request)
     */
    get resultFromQuery() {
        // TODO: we will add the correct option to the AbcResult constructor later
        return true;
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
        var _a;
        return ((_a = this._results.server) === null || _a === void 0 ? void 0 : _a.records) || undefined;
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
    get dynamicPathComponents() {
        return this._context.about.dynamicPathComponents;
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
