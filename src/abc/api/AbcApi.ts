import {
  AbcMutation,
  AbcStrategy,
  DbSyncOperation,
  IAbcApiConfig,
  IAbcOptions,
  IAbcParam,
  IAbcQueryRequest,
  IDiscreteOptions,
  IDiscreteServerResults,
  IFmModelConstructor,
  IQueryLocalResults,
  IQueryOptions,
  IQueryServerResults,
  IWatchCallback,
  QueryType,
  isDiscreteRequest,
  IWatchServerResults,
  SINCE_LAST_COOKIE
} from "@/types";
import {
  AbcResult,
  getDefaultApiConfig,
  getFromIndexedDb,
  getFromVuex,
  mergeLocalRecords,
  queryFirebase,
  queryIndexedDb,
  saveToIndexedDb,
  discreteServerRecords
} from "@/abc";
import {
  DexieDb,
  FireModel,
  IFmModelMeta,
  IPrimaryKey,
  Model,
  Record,
  Watch,
  IReduxDispatch,
  FmEvents,
  IFmWatchEvent
} from "firemodel";
import { IDictionary, pathJoin } from "common-types";
import { capitalize, getStore, setCookie, abcPayload } from "@/util";

import { AbcError } from "@/errors";
import { FireModelError } from "firemodel/dist/es/errors";

/**
 * Provides the full **ABC** API, including `get`, `load`, and `watch` but also
 * including meta-data properties too.
 */
export class AbcApi<T extends Model> {
  /**
   * keeps tabs on all of the `Model`'s which have been configured
   * for the **ABC** API.
   */
  private static _modelsManaged: IDictionary<AbcApi<any>> = {};

  /**
   * The connection to the IndexedDB is not done until the first
   * get/load command is executed. At this point the ABC API will
   * connect to IndexedDB and keep this connection open for all
   * subsequent calls.
   */
  private static _dexieDb: DexieDb;

  /**
   * Boolean flag which indicates whether the IndexedDB is connected
   * for use with the **ABC** API.
   */
  public static get indexedDbConnected() {
    return AbcApi._dexieDb && AbcApi._dexieDb.isOpen() ? true : false;
  }

  /**
   * Adds a model to the managed models dictionary that AbcApi manages.
   */
  public static addModel(model: AbcApi<any>) {
    const modelName = model.about.model.pascal;
    if (AbcApi._modelsManaged[modelName]) {
      throw new AbcError(
        `You have attempted to register the model ${modelName} twice!`,
        `abc-api/invalid-model-registration`
      );
    }

    AbcApi._modelsManaged[modelName] = model;

    return model;
  }

  /**
   * Returns a list of `Model`'s that have been configured
   * for use with the **ABC** API.
   */
  public static get configuredFiremodelModels() {
    return Object.keys(AbcApi._modelsManaged);
  }

  /**
   * Returns constructors for the `Model`s which will be managed by the IndexedDB
   */
  protected static get indexedDbModelConstructors(): IFmModelConstructor<
    any
  >[] {
    return Object.keys(AbcApi._modelsManaged)
      .filter(m => AbcApi._modelsManaged[m].config.useIndexedDb)
      .map(m => AbcApi._modelsManaged[m]._modelConstructor);
  }

  /**
   * returns an `AbcApi` instance for a given `Model`
   */
  public static getModelApi<T extends Model>(model: IFmModelConstructor<T>) {
    const r = Record.create(model);
    const name = capitalize(r.modelName);
    if (!AbcApi._modelsManaged[name]) {
      throw new AbcError(
        `You attempted to get an AbcApi for the model ${name} but it is not yet configured!`,
        "abc-api/invalid-model"
      );
    }
    return AbcApi._modelsManaged[name] as AbcApi<T>;
  }

  /**
   * Clears the **ABC** API from all models that are being managed and disconnects for IndexedDB
   */
  public static async clear() {
    const waitFor: any[] = [];
    Object.keys(AbcApi._modelsManaged).forEach(key => {
      const ref = AbcApi.getModelApi(
        AbcApi._modelsManaged[key].model.constructor
      );
      if (ref.config.useIndexedDb) {
        waitFor.push(ref.dexieTable.clear());
      }
    });
    await Promise.all(waitFor).catch(e => {
      console.warn(e);
    });
    AbcApi._modelsManaged = {};
    if (AbcApi.indexedDbConnected) {
      AbcApi.disconnect();
    }
  }

  public static disconnect() {
    return AbcApi._dexieDb.close();
  }

  /**
   * Connects to the IndexedDB; using all the models the ABC API knows
   * about (and which have been configured to use IndexedDB)
   */
  public static async connectIndexedDb() {
    const models = AbcApi.indexedDbModelConstructors;
    if (models.length > 0) {
      AbcApi._dexieDb = new DexieDb(`ABC-API`, ...models);
      if (!AbcApi._dexieDb.isOpen()) {
        await AbcApi._dexieDb.open();
      }
    } else {
      console.info("ABC API has no models using IndexedDB");
    }
  }

  private _config: IAbcApiConfig<T>;
  private _modelConstructor: IFmModelConstructor<T>;
  // MODEL INFO
  private _dbOffset: string;
  private _dynamicPathComponents: (keyof T & string)[] | false;
  private _modelName: { singular: string; plural: string; pascal: string };
  private _modelMeta: IFmModelMeta<T>;
  // CACHE STATS
  private _cacheHits: number = 0;
  private _cacheMisses: number = 0;
  private _cacheIgnores: number = 0;

  cacheHits(hits: number) {
    this._cacheHits += hits;
  }

  cacheMisses(misses: number) {
    this._cacheMisses += misses;
  }

  constructor(model: IFmModelConstructor<T>, config: IAbcApiConfig<T> = {}) {
    // if (!config.db && FireModel.defaultDb) {
    //   throw new AbcError(`You must provide a way to access the database before you instantiate the ABC API! You can pass it in explicitly as a part of the config or it will pickup the FireModel.defaultDb if that's available.`, 'not-ready')
    // }
    this._modelConstructor = model;
    this._config = { ...getDefaultApiConfig(), ...config };
    const rec = Record.create(this._modelConstructor);
    this._dynamicPathComponents = rec.hasDynamicPath
      ? rec.dynamicPathComponents
      : false;
    this._dbOffset = rec.dbOffset;
    this._modelName = {
      singular: rec.modelName,
      plural: rec.pluralName,
      pascal: capitalize(rec.modelName)
    };
    this._modelMeta = rec.META;
    AbcApi.addModel(this);
  }

  /**
   * Different naming conventions for the model along with the model's
   * constructor
   */
  get model() {
    return { ...this._modelName, constructor: this._modelConstructor };
  }

  /**
   * Everything you wanted to know about this instance of the **ABC** API
   * but were afraid to ask. :)
   */
  get about() {
    return {
      /**
       * Different naming conventions for the model along with the model's
       * constructor
       */
      model: this.model,
      /** The meta infomation associated with the `Model` */
      modelMeta: this._modelMeta,
      /** the ABC API's configuration */
      config: this._config,
      dbOffset: this._dbOffset,
      dynamicPathComponents: this._dynamicPathComponents
    };
  }

  /**
   * Information about the Vuex location
   */
  get vuex() {
    return {
      /**
       * Indicates whether this module has been configured as a _list_
       * or a _record_.
       */
      isList: this.config.isList,
      /**
       * Path to the root of the module
       */
      modulePath: this.config.isList ? this.model.plural : this.model.singular,
      /**
       * The name of the Vuex module who's state
       * is being queried
       */
      moduleName: (this.config.moduleName || this.config.isList
        ? this.about.model.plural
        : this.about.modelMeta.localModelName) as string,
      /**
       * An optional offset to the module to store record(s)
       */
      modulePostfix: this.config.isList
        ? this._modelMeta.localPostfix || "all"
        : "",
      /**
       * The full path to where the record(s) reside
       */
      fullPath: this.config.isList
        ? pathJoin(this.model.plural, this._modelMeta.localPostfix || "all")
        : this.model.singular
    };
  }

  /**
   * Look at the performance of caching of your data for
   * the given `Model`
   */
  get cachePerformance() {
    return {
      /** results found in IndexedDB */
      hits: this._cacheHits,
      /** had to go to Firebase for results */
      misses: this._cacheMisses,
      /** ignored the request as results were already in Vuex */
      ignores: this._cacheIgnores
    };
  }

  /**
   * Get records using the **ABC** API.
   *
   * @request either a Query Helper (since, where, etc.) or an array of primary keys
   */
  async get(
    request: IAbcParam<T>,
    options: IAbcOptions<T> = {}
  ): Promise<AbcResult<T>> {
    if (isDiscreteRequest(request)) {
      return this.getDiscrete(request, options as IDiscreteOptions<T>);
    } else {
      return this.getQuery(request, options);
    }
  }

  /**
   * Load records using the **ABC** API
   *
   * @request either a Query Helper (since, where, etc.) or an array of primary keys
   */
  async load(
    request: IAbcParam<T>,
    options: IAbcOptions<T> = {}
  ): Promise<AbcResult<T>> {
    if (isDiscreteRequest(request)) {
      return this.loadDiscrete(request, options as IDiscreteOptions<T>);
    } else {
      return this.loadQuery(request, options);
    }
  }

  private async getQuery(
    request: IAbcQueryRequest<T>,
    options: IQueryOptions<T> = {}
  ): Promise<AbcResult<T>> {
    const store = getStore();
    // query types all() | where() | since()
    const { dexieQuery, firemodelQuery, queryDefn } = request(this, options);

    let local: IQueryLocalResults<T, any> = {
      records: [],
      indexedDbPks: [],
      localPks: []
    };
    // query indexedDb
    if (this.config.useIndexedDb) {
      // ctx should be model constructor
      local = await queryIndexedDb(this._modelConstructor, dexieQuery);
      const localResults = await AbcResult.create(this, {
        type: "query",
        queryDefn,
        local,
        options
      });

      if (local.records.length > 0) {
        store.commit(
          `${this.vuex.moduleName}/${
            this.hasDynamicProperties
              ? DbSyncOperation.ABC_INDEXED_DB_SET_DYNAMIC_PATH_VUEX
              : DbSyncOperation.ABC_INDEXED_DB_SET_VUEX
          }`,
          abcPayload(localResults)
        );
      } else {
        store.commit(
          `${this.vuex.moduleName}/${AbcMutation.ABC_LOCAL_QUERY_EMPTY}`,
          abcPayload(localResults)
        );
      }
    }

    // query firebase if getFirebase strategy in place
    let server: IQueryServerResults<T> | undefined;
    if (options.strategy === AbcStrategy.getFirebase) {
      // get data from firebase
      queryFirebase(this, firemodelQuery, local).then(async server => {
        const serverResults = await AbcResult.create(this, {
          type: "query",
          queryDefn,
          local,
          server,
          options
        });

        // cache results to IndexedDB
        if (this.config.useIndexedDb) {
          saveToIndexedDb(serverResults, this.dexieTable);
          store.commit(
            `${this.vuex.moduleName}/${
              this.hasDynamicProperties
                ? DbSyncOperation.ABC_FIREBASE_SET_DYNAMIC_PATH_INDEXED_DB
                : DbSyncOperation.ABC_FIREBASE_SET_INDEXED_DB
            }`,
            abcPayload(serverResults)
          );
        }

        store.commit(
          `${this.vuex.moduleName}/${
            this.hasDynamicProperties
              ? DbSyncOperation.ABC_FIREBASE_SET_DYNAMIC_PATH_VUEX
              : DbSyncOperation.ABC_FIREBASE_SET_VUEX
          }`,
          abcPayload(serverResults)
        );

        // watch records
        this.watch(serverResults, options);
        this.watchNew(serverResults, options);
      });
    }

    const response = await AbcResult.create(this, {
      type: "query",
      queryDefn,
      local,
      server,
      options
    });

    return response;
  }

  private async loadQuery(
    request: IAbcQueryRequest<T>,
    options: IQueryOptions<T> = {}
  ): Promise<AbcResult<T>> {
    const store = getStore();
    // query types all() | where() | since()
    const { dexieQuery, firemodelQuery, queryDefn } = request(this, options);

    let local: IQueryLocalResults<T, any> = {
      records: [],
      indexedDbPks: [],
      localPks: []
    };

    // query firebase if getFirebase strategy in place
    // get data from firebase
    const server = await queryFirebase(this, firemodelQuery, local);

    const serverResults = await AbcResult.create(this, {
      type: "query",
      queryDefn,
      local,
      server,
      options
    });

    // cache results to IndexedDB
    if (this.config.useIndexedDb) {
      saveToIndexedDb(serverResults, this.dexieTable);
      // ctx should be model constructor
      const local = await queryIndexedDb(this._modelConstructor, dexieQuery);
      const localResults = await AbcResult.create(this, {
        type: "query",
        queryDefn,
        local,
        options
      });
      if (options.strategy === AbcStrategy.loadVuex) {
        store.commit(
          `${this.vuex.moduleName}/${
            this.hasDynamicProperties
              ? DbSyncOperation.ABC_FIREBASE_SET_DYNAMIC_PATH_INDEXED_DB
              : DbSyncOperation.ABC_FIREBASE_SET_INDEXED_DB
          }`,
          abcPayload(serverResults)
        );

        store.commit(
          `${this.vuex.moduleName}/${DbSyncOperation.ABC_INDEXED_DB_SET_VUEX}`,
          abcPayload(localResults)
        );
      }
    } else {
      if (options.strategy === AbcStrategy.loadVuex) {
        store.commit(
          `${this.vuex.moduleName}/${DbSyncOperation.ABC_FIREBASE_SET_VUEX}`,
          abcPayload(serverResults)
        );
      }
    }

    return serverResults;
  }

  /**
   * Handles GET requests for Discrete ID requests
   */
  private async getDiscrete(
    request: IPrimaryKey<T>[],
    options: IDiscreteOptions<T> = {}
  ): Promise<AbcResult<T>> {
    const store = getStore();
    let idxRecords: T[] = [];
    if (request.length == 0) {
      throw new AbcError(
        `Attempt to load discrete records failed as an empty array was passed in`,
        "invalid-request"
      );
    }

    let requestIds: string[];
    switch (typeof request[0]) {
      case "string":
        if (
          !request[0].includes(":") &&
          this.hasDynamicProperties &&
          !options.offsets
        ) {
          throw new AbcError(
            `Attempt to load discrete records from ABC API but without the propert DB offsets for the model ${capitalize(
              this._modelName.singular
            )}`,
            "invalid-request"
          );
        }
        requestIds =
          this.hasDynamicProperties && request[0].includes(":")
            ? (request as string[])
            : request.map(i =>
                Record.compositeKeyRef(this._modelConstructor, {
                  id: i,
                  ...(options.offsets as Partial<T>)
                })
              );
        break;
      case "object":
        requestIds = request.map(i =>
          Record.compositeKeyRef(this._modelConstructor, i)
        );
        break;
      default:
        throw new AbcError(
          `Unexpected data passed to loadDiscrete()`,
          "not-allowed"
        );
    }

    // get from Vuex
    const vuexRecords = await getFromVuex(this);

    let local = [];
    if (this.config.useIndexedDb) {
      // get from indexedDB
      local = await getFromIndexedDb<T>(this.dexieRecord, requestIds);
    }

    // const local = mergeLocalRecords(this, idxRecords, vuexRecords, requestIds);
    if (local.length > 0) {
      const localResults = await AbcResult.create(this, {
        type: "discrete",
        local,
        options
      });
      store.commit(
        `${this.vuex.moduleName}/${DbSyncOperation.ABC_INDEXED_DB_MERGE_VUEX}`,
        abcPayload(localResults)
      );
    }

    // query firebase if getFirebase strategy in place
    let server: IDiscreteServerResults<T> | undefined;
    if (options.strategy === AbcStrategy.getFirebase) {
      // get from firebase
      discreteServerRecords(this, requestIds).then(async server => {
        const serverResults = await AbcResult.create(this, {
          type: "discrete",
          local,
          server,
          options
        });

        // cache results to IndexedDB
        if (this.config.useIndexedDb) {
          // save to indexedDB
          saveToIndexedDb(serverResults, this.dexieTable);
          store.commit(
            `${this.vuex.moduleName}/${DbSyncOperation.ABC_FIREBASE_MERGE_INDEXED_DB}`,
            abcPayload(serverResults)
          );
        }

        store.commit(
          `${this.vuex.moduleName}/${DbSyncOperation.ABC_FIREBASE_MERGE_VUEX}`,
          abcPayload(serverResults)
        );
      });
    }

    const response = await AbcResult.create(this, {
      type: "discrete",
      local,
      server,
      options
    });

    return response;
  }

  /**
   * Handles LOAD requests for Discrete ID requests
   */
  private async loadDiscrete(
    request: IPrimaryKey<T>[],
    options: IDiscreteOptions<T> = {}
  ): Promise<AbcResult<T>> {
    const store = getStore();

    if (request.length == 0) {
      throw new AbcError(
        `Attempt to load discrete records failed as an empty array was passed in`,
        "invalid-request"
      );
    }

    let requestIds: string[];
    switch (typeof request[0]) {
      case "string":
        if (
          !request[0].includes(":") &&
          this.hasDynamicProperties &&
          !options.offsets
        ) {
          throw new AbcError(
            `Attempt to load discrete records from ABC API but without the propert DB offsets for the model ${capitalize(
              this._modelName.singular
            )}`,
            "invalid-request"
          );
        }
        requestIds =
          this.hasDynamicProperties && request[0].includes(":")
            ? (request as string[])
            : request.map(i =>
                Record.compositeKeyRef(this._modelConstructor, {
                  id: i,
                  ...(options.offsets as Partial<T>)
                })
              );
        break;
      case "object":
        requestIds = request.map(i =>
          Record.compositeKeyRef(this._modelConstructor, i)
        );
        break;
      default:
        throw new AbcError(
          `Unexpected data passed to loadDiscrete()`,
          "not-allowed"
        );
    }

    const server = await discreteServerRecords(this, requestIds);
    const serverResults = await AbcResult.create(this, {
      type: "discrete",
      server,
      options
    });
    // cache results to IndexedDB
    if (this.config.useIndexedDb) {
      // save to indexedDB
      saveToIndexedDb(serverResults, this.dexieTable);

      if (options.strategy === AbcStrategy.loadVuex) {
        store.commit(
          `${this.vuex.moduleName}/${DbSyncOperation.ABC_FIREBASE_MERGE_INDEXED_DB}`,
          abcPayload(serverResults)
        );
      }
    }

    if (options.strategy === AbcStrategy.loadVuex) {
      // load data into vuex
      store.commit(
        `${this.vuex.moduleName}/${DbSyncOperation.ABC_FIREBASE_MERGE_VUEX}`,
        abcPayload(serverResults)
      );
    }

    // const perfOverall = t2 - t0;
    const results = await AbcResult.create(this, {
      type: "discrete",
      options,
      server
    });
    return results;
  }

  get hasDynamicProperties() {
    return Record.dynamicPathProperties(this._modelConstructor).length > 0;
  }

  /**
   * Provides access to the Firebase database
   */
  get db() {
    const db = this.config.db || FireModel.defaultDb;
    if (!db) {
      throw new AbcError(
        `Attempt to access the database via the db getter failed which means that the ABC API was not given a database connector and there is no "defaultDb" set with Firemodel.`
      );
    }

    return db;
  }

  /**
   * The **ABC** configuration for this instance's `Model`
   */
  get config() {
    return this._config;
  }

  get dexieModels() {
    return this.dexie.dexieTables;
  }

  /**
   * Provides access to this Dexie **Table API**
   */
  get dexieTable() {
    return this.dexie.table(this._modelConstructor);
  }

  /**
   * Provides access to this Dexie **Record API**
   */
  get dexieRecord() {
    return this.dexie.record(this._modelConstructor);
  }

  /**
   * Provides access to this Dexie **List API**
   */
  get dexieList() {
    return this.dexie.list(this._modelConstructor);
  }

  protected get dexie() {
    if (!this.about.config.useIndexedDb) {
      throw new AbcError(
        `You are attempting to access Dexie while connected to the ABC API with the model ${this.about.model.pascal} which is configured NOT to use IndexedDB!`,
        "not-allowed"
      );
    }

    if (!AbcApi._dexieDb) {
      throw new AbcError(
        `The Dexie database is not yet connected; calls to get() or load() will automatically connect it but if you want to access it prior to that you must call connectDexie()`,
        "not-ready"
      );
    }
    return AbcApi._dexieDb;
  }

  /**
   * Connects Dexie to IndexedDB for _all_ Firemodel Models
   */
  async connectDexie() {
    return AbcApi.connectIndexedDb();
  }

  /**
   * Create watcher and attach a dispatcher to it to ensure that all mutations
   * are ABC related.
   */
  watcherSetup(options: IAbcOptions<T> = {}) {
    const store = getStore();
    const dispatcher: IReduxDispatch<IFmWatchEvent<T>> = async payload => {
      const events = [
        FmEvents.RECORD_ADDED,
        FmEvents.RECORD_CHANGED,
        FmEvents.RECORD_REMOVED
      ];

      if (!events.includes(payload.type)) return;

      const server: IWatchServerResults<T> = {
        records: [payload.value]
      };

      const result = await AbcResult.create(this, {
        type: "watch",
        underlying: payload.eventFamily === "child" ? "query" : "discrete",
        options: {
          offsets: payload.compositeKey
        },
        server
      });

      store.commit(FmEvents.WATCHER_STARTED, payload);

      if (this.config.useIndexedDb) {
        saveToIndexedDb(result, this.dexieTable);
        if (options.strategy === AbcStrategy.loadVuex) {
          store.commit(
            `${this.vuex.moduleName}/${DbSyncOperation.ABC_FIREBASE_SET_INDEXED_DB}`,
            result
          );
        }
      }

      // set new cookie with timestamp
      setCookie(this.model.pascal);
    };
    const watcher = Watch.list(this._modelConstructor);
    watcher.dispatch(dispatcher);

    return watcher;
  }

  /**
   * Watch records using the **ABC** API
   */
  async watch(serverResponse: AbcResult<T>, options: IAbcOptions<T>) {
    const { watch } = options;
    if (watch) {
      const isFunction = (x: any): x is IWatchCallback<T> =>
        typeof x === "function";
      const watcher = this.watcherSetup(options);
      const watchIds = isFunction(watch)
        ? serverResponse.records.filter(p => watch(p)).map(p => p.id!)
        : serverResponse.records.map(p => p.id!);
      await watcher.ids(...watchIds).start();
    }
  }

  /**
   * Watch records using the **ABC** API
   */
  async watchNew(serverResponse: AbcResult<T>, options: IQueryOptions<T>) {
    const { watchNew } = options;
    if (watchNew) {
      const watcher = this.watcherSetup(options);
      if (serverResponse.resultFromQuery && serverResponse.query) {
        await watcher.fromQuery(serverResponse.query).start();
        // console.info(
        //   `${this._modelConstructor.name} watch query: `,
        //   serverResponse.query?.toString()
        // );
      }
    }
  }

  toJSON() {
    return {
      model: this.about.model.pascal,
      config: this.about.config,
      cachePerformance: this.cachePerformance
    };
  }

  toString() {
    return `ABC API for the "${this.about.model.pascal}" model [ cache: ${this.cachePerformance.hits}/${this.cachePerformance.misses} ]`;
  }
}
