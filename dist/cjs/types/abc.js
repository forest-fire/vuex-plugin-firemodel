"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isDiscreteRequest(request) {
    return typeof request !== "function";
}
exports.isDiscreteRequest = isDiscreteRequest;
var AbcMutation;
(function (AbcMutation) {
    /**
     * An update to a Vuex module's primary state that originated
     * from cached information in IndexedDB. This would be the full
     * array of records in the case of a _list_ and a hash replacement
     * in the case of singular _record_ based module.
     */
    AbcMutation["ABC_VUEX_UPDATE_FROM_IDX"] = "ABC_VUEX_UPDATE_FROM_IDX";
    /**
     * Attempt to get additional information from IndexedDB but currently
     * Vuex has all of the records that IndexedDB has
     */
    AbcMutation["ABC_INDEXED_SKIPPED"] = "ABC_INDEXED_SKIPPED";
    /**
     * Neither Vuex nor IndexedDB had any cached data on the records requested
     */
    AbcMutation["ABC_NO_CACHE"] = "ABC_NO_CACHE";
    /**
     * The given Vuex module has been cleared from Vuex
     */
    AbcMutation["ABC_MODULE_CLEARED"] = "ABC_MODULE_CLEAR";
    /**
     * The given `Model` has been cleared from IndexedDB
     */
    AbcMutation["ABC_INDEXED_CLEARED"] = "ABC_INDEXED_CLEARED";
    /**
     * Vuex was updated from the server results
     */
    AbcMutation["ABC_FIREBASE_TO_VUEX_UPDATE"] = "ABC_FIREBASE_TO_VUEX_UPDATE";
    /**
     * Vuex was reset with new results from Firebase
     */
    AbcMutation["ABC_FIREBASE_TO_VUEX_SET"] = "ABC_FIREBASE_TO_VUEX_UPDATE";
    /**
     * The IndexedDB was updated from Firebase
     */
    AbcMutation["ABC_FIREBASE_REFRESH_INDEXED_DB"] = "ABC_FIREBASE_REFRESH_INDEXED_DB";
    /**
     * A Query was run against IndexedDB and it's results will be added/updated
     * into the current Vuex state (until/if the server provides an updated set of
     * records)
     */
    AbcMutation["ABC_LOCAL_QUERY_TO_VUEX"] = "ABC_LOCAL_QUERY_TO_VUEX";
    /**
     * A Query was run against IndexedDB but no results were returned
     */
    AbcMutation["ABC_LOCAL_QUERY_EMPTY"] = "ABC_LOCAL_QUERY_EMPTY";
    /**
     * An attempt to refresh the IndexedDB failed
     */
    AbcMutation["ABC_INDEXED_DB_REFRESH_FAILED"] = "ABC_INDEXED_DB_REFRESH_FAILED";
    /**
     * when a query from IndexedDb returns id's which the server doesn't return
     * then these records are assumed to be "stale" and are removed from IndexedDb
     */
    AbcMutation["ABC_PRUNE_STALE_IDX_RECORDS"] = "ABC_PRUNE_STALE_IDX_RECORDS";
    /**
     * when a record is detected as no longer available (on the back of a server response), this
     * mutation will remove the record from Vuex.
     */
    AbcMutation["ABC_PRUNE_STALE_VUEX_RECORDS"] = "ABC_PRUNE_STALE_VUEX_RECORDS";
})(AbcMutation = exports.AbcMutation || (exports.AbcMutation = {}));
var AbcDataSource;
(function (AbcDataSource) {
    AbcDataSource["vuex"] = "vuex";
    AbcDataSource["indexedDb"] = "indexedDb";
    AbcDataSource["firebase"] = "firebase";
})(AbcDataSource = exports.AbcDataSource || (exports.AbcDataSource = {}));
var QueryType;
(function (QueryType) {
    QueryType["all"] = "all";
    QueryType["where"] = "where";
    QueryType["since"] = "since";
})(QueryType = exports.QueryType || (exports.QueryType = {}));
exports.SINCE_LAST_COOKIE = "slc";
/**
 * Strategies for "get" requests for Query's.
 *
 * A "strategy" is a modifier in the default path/strategy
 * of getting data from the various sources (e.g., Vuex, IndexedDb, Firebase)
 */
var AbcGetStrategy;
(function (AbcGetStrategy) {
    /** Queries will request data from */
    AbcGetStrategy["localOnly"] = "localOnly";
})(AbcGetStrategy = exports.AbcGetStrategy || (exports.AbcGetStrategy = {}));
//# sourceMappingURL=abc.js.map