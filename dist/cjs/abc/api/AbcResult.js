"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typed_conversions_1 = require("typed-conversions");
const errors_1 = require("../../errors");
/**
 * Whenever the `api.get()` or `api.load()` calls return they will
 * respond with this class. The classes goal is to pass back not only
 * the result but also certain meta data and a simple means to conditionally
 * watch certain elements of the returned resultset.
 */
class AbcResult {
    constructor(_context, _results) {
        this._context = _context;
        this._results = _results;
    }
    /**
     * All of the updated records in Vuex that originated from either IndexedDB or Firebase
     */
    get records() {
        if (!this.options.mergeRecords) {
            return this.serverRecords.length > 0
                ? this.serverRecords
                : this.localRecords;
        }
        else {
            const local = typed_conversions_1.arrayToHash(this.localRecords);
            const server = typed_conversions_1.arrayToHash(this.serverRecords);
            return typed_conversions_1.hashToArray(Object.assign(Object.assign({}, local), server));
        }
    }
    /**
     * All of the updated records in Vuex that originated from IndexedDB
     */
    get localRecords() {
        return this._results.local.records || [];
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
            throw new errors_1.AbcError(`The attempt to reference the result's "queryDefn" is invalid in non-query based results!`, "not-allowed");
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
exports.AbcResult = AbcResult;
//# sourceMappingURL=AbcResult.js.map