import { IFmModelConstructor } from "./config";
import { Model, IPrimaryKey, fk, ICompositeKey } from "firemodel";
import { IDictionary } from "firemock";
import { AbcApi } from "../abc/api/AbcApi";
import { DB } from "abstracted-client";
import { AbcResult } from "../abc";
import { epochWithMilliseconds } from "common-types";

export interface IAbcApiConfig<T extends Model> {
  /**
   * indicates whether the Vuex store is storing a _list_
   * of this type of `Model` or just a single _record_.
   */
  isList?: boolean;
  /**
   * indicates whether this API instantiation should cache data
   * in the **IndexedDB** or not.
   */
  useIndexedDb?: boolean;
  /**
   * indicates that the underlying `Model` of this API has _some_
   * properties which are sensitive and these should be encrypted
   * and decrypted when saving to **IndexedDB**.
   *
   * The properties which are encrypted will be those which have
   * the `@encrypt` decorator in their model definition.
   */
  encrypt?: boolean;
  /**
   * You can explicitly set the database access; if not set as an
   * option then it will rely on **Firemodel**'s _defaultDb_ being
   * set.
   */
  db?: DB;

  /**
   * Firemodel typically determines the local path for you but
   * if you need to you can override this path a whatever you like.
   *
   * **Note:** this path will be used not only in the **ABC** API but also when
   * responding to Firemodel mutations as well.
   */
  moduleName?: string;
}

/**
 * Any of the provided Query Helpers which include
 * `all`, `since`, and `where`
 */
export interface IAbcQueryHelper {
  <T extends Model>(defn?: IAbcQueryDefinition<T>): IAbcQueryRequest<T>;
  // isQueryHelper: true;
}

/**
 * Recieves a _list_ of type T and returns either the same
 * list or a subset of it.
 */
export interface IAbcPostWatcher<T extends Model> {
  (results: T[]): T[];
}

/** An **ABC** request for discrete primary keys */
export interface IAbcDiscreteRequest<T extends Model> extends IAbcRequest<T> {
  (pks: IPrimaryKey<T>[], options?: IAbcOptions<T>): Promise<AbcResult<T>>;
}

export type IAbcParam<T> = IPrimaryKey<T>[] | IAbcQueryRequest<T>;

/** An **ABC** request for records using a Query Helper */
export interface IAbcQueryRequest<T extends Model> {
  (command: AbcRequestCommand, ctx: AbcApi<T>, options: IQueryOptions<T>): Promise<AbcResult<T>>;
}

/**
 * Any valid ABC request including both Discrete and Query based requests
 */
export interface IAbcRequest<T> {
  (param: IAbcParam<T>, options?: IAbcOptions<T>): Promise<AbcResult<T>>;
}

export function isDiscreteRequest<T>(request: IAbcParam<T>): request is IPrimaryKey<T>[] {
  return typeof request !== "function";
}

/** The specific **ABC** request command */
export type AbcRequestCommand = "get" | "load";

export interface IQueryLocalResults<T, K = IDictionary> {
  records: T[];
  localPks: string[];
  vuexPks: string[];
  indexedDbPks: string[];
}

/**
 * Results from a Query request to Firebase server
 */
export interface IQueryServerResults<T, K = IDictionary> {
  records: T[];
  /** all of the primary keys which were received by the Firebase query */
  serverPks: string[];
  /** the primary keys which were found by Firebase but not known by local state */
  newPks: string[];
  /** the primary keys which had been correctly represented in local/cache state */
  cacheHits: string[];
  /** the primary keys which had stale data in local state */
  stalePks: string[];
  /** pks removed from IndexedDB */
  removeFromIdx: string[];
  /** pks removed from Vuex */
  removeFromVuex: string[];
  overallCachePerformance: ICachePerformance;
}

/**
 * Results from an ABC get/load which were retrieved from
 * the combined knowledge of Vuex and IndexedDB. The records
 * presented will favor data in Vuex over IndexedDB if there
 * is ever a conflict.
 */
export interface IDiscreteLocalResults<T, K = IDictionary> extends IAbcResultsMeta<T> {
  /** How many of the records _were_ found locally */
  cacheHits: number;
  /**
   * How many of the records were not found locally
   */
  cacheMisses: number;

  /**
   * Boolean flag indicating whether all requested foreign keys
   * were found locally
   */
  allFoundLocally: boolean;
  /**
   * The array of primary keys which were found in **Vuex**
   */
  foundInVuex: string[];
  /**
   * The array of primary keys which were found in **IndexedDb**
   */
  foundInIndexedDb: string[];
  /**
   * Those primary keys which were _not_ in Vuex but were found in
   * **IndexedDB**
   */
  foundExclusivelyInIndexedDb: string[];
  /**
   * The records which were gotten from the Vuex and IndexedDB
   */
  records: T[];
  /**
   * The primary keys (in string form) which were NOT
   * found in the local caches.
   */
  missing: string[];
}

export interface ICachePerformance {
  hits: number;
  misses: number;
  ignores: number;
}

export interface IDiscreteServerResults<T extends Model, K = IDictionary> extends IAbcResultsMeta<T> {
  /**
   * The primary keys being requested from the server
   */
  pks: string[];
  /**
   * The full set of primary keys that were requested from the ABC API (this is either equivalent
   * to `fks` or a superset if local caching removed some entries)
   */
  allPks: string[];
  /**
   * Any keys which were NOT found on the server
   */
  missing: string[];
  records: T[];
}

export interface IAbcResultsMeta<T> {
  /**
   * The overall cache performance for the given `Model` to date
   */

  overallCachePerformance: ICachePerformance;
  /**
   * The **ABC** API command used when originating this request
   */
  apiCommand: AbcRequestCommand;
  /**
   * The combination of the `Model`'s ABC configuration merged
   * with the options included in the API call
   */
  modelConfig: IAbcApiConfig<T>;
}

export enum AbcMutation {
  /**
   * An update to a Vuex module's primary state that originated
   * from cached information in IndexedDB. This would be the full
   * array of records in the case of a _list_ and a hash replacement
   * in the case of singular _record_ based module.
   */
  ABC_VUEX_UPDATE_FROM_IDX = "ABC_VUEX_UPDATE_FROM_IDX",
  /**
   * Attempt to get additional information from IndexedDB but currently
   * Vuex has all of the records that IndexedDB has
   */
  ABC_INDEXED_SKIPPED = "ABC_INDEXED_SKIPPED",
  /**
   * Neither Vuex nor IndexedDB had any cached data on the records requested
   */
  ABC_NO_CACHE = "ABC_NO_CACHE",
  /**
   * The given Vuex module has been cleared from Vuex
   */
  ABC_MODULE_CLEARED = "ABC_MODULE_CLEAR",
  /**
   * The given `Model` has been cleared from IndexedDB
   */
  ABC_INDEXED_CLEARED = "ABC_INDEXED_CLEARED",
  /**
   * Vuex was updated from the server results
   */
  ABC_FIREBASE_TO_VUEX_UPDATE = "ABC_FIREBASE_TO_VUEX_UPDATE",
  /**
   * Vuex was reset with new results from Firebase
   */
  ABC_FIREBASE_TO_VUEX_SET = "ABC_FIREBASE_TO_VUEX_UPDATE",
  /**
   * The IndexedDB was updated from Firebase
   */
  ABC_FIREBASE_REFRESH_INDEXED_DB = "ABC_FIREBASE_REFRESH_INDEXED_DB",
  /**
   * A Query was run against IndexedDB and it's results will be added/updated
   * into the current Vuex state (until/if the server provides an updated set of
   * records)
   */
  ABC_LOCAL_QUERY_TO_VUEX = "ABC_LOCAL_QUERY_TO_VUEX",
  /**
   * A Query was run against IndexedDB but no results were returned
   */
  ABC_LOCAL_QUERY_EMPTY = "ABC_LOCAL_QUERY_EMPTY",
  /**
   * An attempt to refresh the IndexedDB failed
   */
  ABC_INDEXED_DB_REFRESH_FAILED = "ABC_INDEXED_DB_REFRESH_FAILED",
  /**
   * when a query from IndexedDb returns id's which the server doesn't return
   * then these records are assumed to be "stale" and are removed from IndexedDb
   */
  ABC_PRUNE_STALE_IDX_RECORDS = "ABC_PRUNE_STALE_IDX_RECORDS",
  /**
   * when a record is detected as no longer available (on the back of a server response), this
   * mutation will remove the record from Vuex.
   */
  ABC_PRUNE_STALE_VUEX_RECORDS = "ABC_PRUNE_STALE_VUEX_RECORDS"
}

export enum AbcDataSource {
  vuex = "vuex",
  indexedDb = "indexedDb",
  firebase = "firebase"
}

export enum QueryType {
  all = "all",
  where = "where",
  since = "since"
}

export type IAbcQueryDefinition<T> =
  | IAbcAllQueryDefinition<T>
  | IAbcWhereQueryDefinition<T>
  | IAbcSinceQueryDefinition<T>;

export interface IAbcAllQueryDefinition<T> extends IAbcQueryBaseDefinition {
  queryType: QueryType.all;
}

export interface IAbcWhereQueryEquals<T extends Model> extends IAbcQueryBaseDefinition {
  // queryType: QueryType.where;
  property: keyof T & string;
  equals: any;
  lessThan?: never;
  greaterThan?: never;
}
export interface IAbcWhereQueryGreaterThan<T extends Model> extends IAbcQueryBaseDefinition {
  // queryType: QueryType.where;
  property: keyof T & string;
  equals?: never;
  lessThan?: never;
  greaterThan: any;
}
export interface IAbcWhereQueryLessThan<T extends Model> extends IAbcQueryBaseDefinition {
  // queryType: QueryType.where;
  property: keyof T & string;
  equals?: never;
  lessThan: any;
  greaterThan?: never;
}

/**
 * Allows definition of a _property_ on the model and an operation
 * to use for comparison/filtering purposes
 */
export type IAbcWhereQueryDefinition<T extends Model> =
  | IAbcWhereQueryEquals<T>
  | IAbcWhereQueryGreaterThan<T>
  | IAbcWhereQueryLessThan<T>;

export interface IAbcSinceQueryDefinition<T> extends IAbcQueryBaseDefinition {
  // queryType: QueryType.since;
  /**
   * Look for records which have been modified since the given timestamp;
   * if left _undefined_ the value will be
   */
  timestamp?: epochWithMilliseconds;
}

export interface IAbcQueryBaseDefinition {
  queryType?: string;
  limit?: number;
  offset?: number;
}

/**
 * A discrete request's result (`IDiscreteLocalResults`) which definitely has
 * a "local" response and optionally also includes a "server" response. Also
 * includes meta for Vuex.
 */
export interface IDiscreteResult<T, K = any> {
  type: "discrete";
  local?: IDiscreteLocalResults<T, K>;
  server?: IDiscreteServerResults<T, K>;
  options: IDiscreteOptions<T>;
}

/**
 * A query result (`IQueryLocalResults`) which definitely has a "local" response
 * and optionally also includes a "server" response. Also includes meta for Vuex.
 */
export interface IQueryResult<T, K = any> {
  type: "query";
  queryDefn: IAbcQueryDefinition<T>;
  local?: IQueryLocalResults<T, K>;
  server?: IQueryServerResults<T, K>;
  options: IQueryOptions<T>;
}

/**
 * The results from either a Discrete or Query-based request.
 */
export type IAbcResult<T, K = any> = IDiscreteResult<T, K> | IQueryResult<T, K>;

export interface IQueryOptions<T> extends IUniversalOptions<T> {
  /**
   * If the `Model` being queries has a dynamic path then you will need to
   * state the dynamic path segments so the the database path for Firebase
   * can be determined (and so IndexedDB can use a more involved query)
   */
  offsets?: Partial<T>;
}

export interface IDiscreteOptions<T> extends IUniversalOptions<T> {
  /**
   * If the `Model` involved has dynamic paths, you can state the dynamic properties
   * as an option and then just state the `id` properties for the records you want.
   *
   * **Note:** you may also ignore this option but you must then state the full Composite Key
   * involved in identifying the various Pks.
   */
  offsets?: Partial<T>;
}

export interface IUniversalOptions<T> {
  /**
   * When set, this flag tells any local & server based response to merge
   * the combined knowledge into the `AbcResult.records` array. By default
   * this option is `false`.
   */
  mergeRecords?: boolean;
}

// export interface IAbcOptions<T> {
//   watch?: IAbcPostWatcher<T>;
//   watchNew?: boolean;
//   /**
//    * If you are using a Query Helper you can state that you
//    * want to have ALL locally cached state in IndexedDB
//    */
//   allLocally?: boolean;
// }

export type IAbcOptions<T> = (IDiscreteOptions<T> | IQueryOptions<T>) & IAnyOptions<T>;

export interface IAnyOptions<T> {
  watch?: boolean | IWatchCallback<T>;
  watchNew?: boolean;
  // TODO: this should be more strongly typed AND scoped to get versus load
  strategy?: string;
}

export interface IWatchCallback<T> {
  (r: T): boolean;
}

/** the shape of the get/load endpoints for Discrete requests */
export interface IAbcDiscreteApi<T> {
  get: (props: IPrimaryKey<T>[], options: IDiscreteOptions<T>) => Promise<AbcResult<T>>;
  load: (props: IPrimaryKey<T>[], options: IDiscreteOptions<T>) => Promise<AbcResult<T>>;
}

/** the shape of the get/load endpoints for Query requests */
export interface IAbcQueryApi<T> {
  get: (defn: IAbcQueryDefinition<T>, options: IQueryOptions<T>) => Promise<AbcResult<T>>;
  load: (props: IAbcQueryDefinition<T>, options: IQueryOptions<T>) => Promise<AbcResult<T>>;
}

export const SINCE_LAST_COOKIE = "slc";

/**
 * Strategies for "get" requests for Query's.
 *
 * A "strategy" is a modifier in the default path/strategy
 * of getting data from the various sources (e.g., Vuex, IndexedDb, Firebase)
 */
export enum AbcGetStrategy {
  /** Queries will request data from */
  localOnly = "localOnly"
}
