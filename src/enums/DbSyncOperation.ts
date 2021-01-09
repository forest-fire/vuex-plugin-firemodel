/**
 * Operation between two data sources (Firebase, IndexedDB, Vuex) to appropriatly syncronize them.
 */
export enum DbSyncOperation {
  /**
   * IndexedDB was set from Firebase (this is a non dynamic
   * path model and firebase fully replaced what was in indexedDB)
   */
  ABC_FIREBASE_SET_INDEXED_DB = 'ABC_FIREBASE_SET_INDEXED_DB',
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
  ABC_FIREBASE_SET_DYNAMIC_PATH_INDEXED_DB = 'ABC_FIREBASE_SET_DYNAMIC_PATH_INDEXED_DB',
  /**
   * Firebase was merged with IndexedDB. This happens when querying firebase
   * for a subset of a particular model (e.g., discrete request or _where_ clause;
   * but not an _all_ clause). This results in the datasets from firebase and
   * indexedDB being merged with firebase always winning unknown conflicts.
   */
  ABC_FIREBASE_MERGE_INDEXED_DB = 'ABC_FIREBASE_MERGE_INDEXED_DB',
  /**
   * Results from a query based GET where the underlying model does not have a
   * dynamic path.
   */
  ABC_INDEXED_DB_SET_VUEX = 'ABC_INDEXED_DB_SET_VUEX',
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
  ABC_INDEXED_DB_SET_DYNAMIC_PATH_VUEX = 'ABC_INDEXED_DB_SET_DYNAMIC_PATH_VUEX',
  ABC_INDEXED_DB_MERGE_VUEX = 'ABC_INDEXED_DB_MERGE_VUEX',
  ABC_FIREBASE_SET_VUEX = 'ABC_FIREBASE_SET_VUEX',
  ABC_FIREBASE_SET_DYNAMIC_PATH_VUEX = 'ABC_FIREBASE_SET_DYNAMIC_PATH_VUEX',
  ABC_FIREBASE_MERGE_VUEX = 'ABC_FIREBASE_MERGE_VUEX',
}
