import { IFmModelConstructor } from "./config";
import { Model, IPrimaryKey, fk, ICompositeKey } from "firemodel";
import { IDictionary } from "firemock";
import { AbcApi } from "../abc/api/AbcApi";
import { DB } from "abstracted-client";

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
export interface IAbcQueryHelper<T> {
  (...args: any[]): Promise<any>;
  isQueryHelper: true;
}

export interface IAbcOptions<T> {
  watch?: IAbcPostWatcher<T>;
  watchNew?: boolean;
  /**
   * If you are using a Query Helper you can state that you
   * want to have ALL locally cached state in IndexedDB
   */
  allLocally?: boolean;
}

/**
 * Recieves a _list_ of type T and returns either the same
 * list or a subset of it.
 */
export interface IAbcPostWatcher<T extends Model> {
  (results: T[]): T[];
}

/** An **ABC** request for discrete primary keys */
export type IAbcDiscreteRequest<T extends Model> = IPrimaryKey<T>[];

/** An **ABC** request for records using a Query Helper */
export interface IAbcQueryRequest<T extends Model> {
  (query: IAbcQueryHelper<T>, options?: IAbcOptions<T>): IAbcConfiguredQuery<T>;
}

export function isDiscreteRequest<T>(
  request: IAbcDiscreteRequest<T> | IAbcConfiguredQuery<T>
): request is IAbcDiscreteRequest<T> {
  return typeof request !== "function";
}

/** The specific **ABC** request command */
export type AbcRequestCommand = "get" | "load";

/**
 * once the consumer has configured a helper query it must still be passed
 * additional context by the `AbcApi` to help complete the task.
 */
export interface IAbcConfiguredQuery<T> {
  (
    command: AbcRequestCommand,
    options: IAbcOptions<T>,
    context: AbcApi<T>
  ): Promise<T[]>;
}

/**
 * Results from an ABC get/load which were retrieved from
 * the combined knowledge of Vuex and IndexedDB. The records
 * presented will favor data in Vuex over IndexedDB if there
 * is ever a conflict.
 */
export interface IDiscreteLocalResults<T, K = IDictionary>
  extends IAbcVuexMeta<K>,
    IAbcResultsMeta<T> {
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

export interface IDiscreteServerResults<T extends Model, K = IDictionary>
  extends IAbcVuexMeta<K>,
    IAbcResultsMeta<T> {
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

export interface IAbcVuexMeta<K> {
  /**
   * The name of the Vuex module who's state
   * is being queried
   */
  vuexModuleName: string;
  /**
   * Flag to indicate whether the given Vuex module has a
   * _list_ of records or just a singular _record_.
   */
  moduleIsList: boolean;
  /**
   * Typically used only for _list_-based modules; it represents the
   * property name which the list is hung off of and defaults to 'all'.
   */
  modulePostfix: keyof K & string;
}

export enum AbcMutation {
  /**
   * An update to a Vuex module's primary state that originated
   * from cached information in IndexedDB. This would be the full
   * array of records in the case of a _list_ and a hash replacement
   * in the case of singular _record_ based module.
   */
  ABC_LOCAL_CACHE_UPDATE = "ABC_LOCAL_CACHE_UPDATE",
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
  ABC_SERVER_UPDATE = "ABC_SERVER_UPDATE",
  /**
   * The IndexedDB was updated from Firebase
   */
  ABC_INDEXED_UPDATED = "ABC_INDEXED_UPDATED"
}

export enum AbcDataSource {
  vuex = "vuex",
  indexedDb = "indexedDb",
  firebase = "firebase"
}
