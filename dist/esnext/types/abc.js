export function isDiscreteRequest(request) {
    return typeof request !== "function";
}
/**
 * Operation between two data sources (Firebase, IndexedDB, Vuex) to appropriatly syncronize them.
 */
export var DbSyncOperation;
(function (DbSyncOperation) {
    /**
     * IndexedDB was set from Firebase (this is a non dynamic
     * path model and firebase fully replaced what was in indexedDB)
     */
    DbSyncOperation["ABC_FIREBASE_SET_INDEXED_DB"] = "ABC_FIREBASE_SET_INDEXED_DB";
    /**
     * IndexedDB was set from Firebase (this is a dynamic path model
     * and firebase should only replace whats in indexedDB for the particular
     * dynamic path segment, indexedDB maintains all data outside of the
     * dynamic path segment)
     *
     * e.g. if you query firebase for all products of a particular store:
     *
     * ```typescript
     * getProducts(all(), { offsets: { storeId: '1234' }});
     * ```
     * Whatever firebase says about store with id 1234 is correct and indexedDB
     * replaces all records with storeId 1234 to the same as firebase. However,
     * indexedDB retains all knowledge of products outside of storeId 1234.
     */
    DbSyncOperation["ABC_FIREBASE_SET_DYNAMIC_PATH_INDEXED_DB"] = "ABC_FIREBASE_SET_DYNAMIC_PATH_INDEXED_DB";
    /**
     * Firebase was merged with IndexedDB. This happens when querying firebase
     * for a subset of a particular model (e.g., discrete request or _where_ clause;
     * but not an _all_ clause). This results in the datasets from firebase and
     * indexedDB being merged with firebase always winning any conflicts.
     */
    DbSyncOperation["ABC_FIREBASE_MERGE_INDEXED_DB"] = "ABC_FIREBASE_MERGE_INDEXED_DB";
    /**
     * Results from a query based GET where the underlying model does not have a
     * dynamic path.
     */
    DbSyncOperation["ABC_INDEXED_DB_SET_VUEX"] = "ABC_INDEXED_DB_SET_VUEX";
    /**
     * Vuex was set from IndexedDB (this is a dynamic path model
     * and IndexedDB should only replace whats in Vuex for the particular
     * dynamic path segment, Vuex maintains all data outside of the
     * dynamic path segment)
     *
     * e.g. if you query firebase for all products of a particular store:
     *
     * ```typescript
     * getProducts(all(), { offsets: { storeId: '1234' }});
     * ```
     */
    DbSyncOperation["ABC_INDEXED_DB_SET_DYNAMIC_PATH_VUEX"] = "ABC_INDEXED_DB_SET_DYNAMIC_PATH_VUEX";
    DbSyncOperation["ABC_INDEXED_DB_MERGE_VUEX"] = "ABC_INDEXED_DB_MERGE_VUEX";
    DbSyncOperation["ABC_FIREBASE_SET_VUEX"] = "ABC_FIREBASE_SET_VUEX";
    DbSyncOperation["ABC_FIREBASE_SET_DYNAMIC_PATH_VUEX"] = "ABC_FIREBASE_SET_DYNAMIC_PATH_VUEX";
    DbSyncOperation["ABC_FIREBASE_MERGE_VUEX"] = "ABC_FIREBASE_MERGE_VUEX";
})(DbSyncOperation || (DbSyncOperation = {}));
export var AbcMutation;
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
})(AbcMutation || (AbcMutation = {}));
export var AbcDataSource;
(function (AbcDataSource) {
    AbcDataSource["vuex"] = "vuex";
    AbcDataSource["indexedDb"] = "indexedDb";
    AbcDataSource["firebase"] = "firebase";
})(AbcDataSource || (AbcDataSource = {}));
export var QueryType;
(function (QueryType) {
    QueryType["all"] = "all";
    QueryType["where"] = "where";
    QueryType["since"] = "since";
})(QueryType || (QueryType = {}));
export var AbcStrategy;
(function (AbcStrategy) {
    AbcStrategy["loadVuex"] = "loadVuex";
    /**
     * Forces **get** based queries to always go to firebase (however promise is returned after
     * local query); this does not affect _discrete_ gets or any load queries.
     */
    AbcStrategy["getFirebase"] = "getFirebase";
})(AbcStrategy || (AbcStrategy = {}));
export const SINCE_LAST_COOKIE = "slc";
