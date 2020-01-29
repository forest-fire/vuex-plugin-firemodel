import {
  Model,
  Record,
  IFmModelMeta,
  FireModel,
  DexieDb,
  IPrimaryKey
} from "firemodel";
import {
  IAbcApiConfig,
  IAbcDiscreteRequest,
  IAbcConfiguredQuery,
  IAbcOptions,
  isDiscreteRequest,
  AbcMutation
} from "../../types/abc";
import { getDefaultApiConfig } from "../configuration/configApi";
import { removeProperty, capitalize } from "../../shared";
import { IDictionary } from "firemock";
import { IFmModelConstructor } from "../../types";
import { AbcError } from "../../errors";
import { localRecords } from "./api-parts/localRecords";
import { updateVuexFromIndexedDb } from "./shared/updateVuex";
import { store } from "../../../test/store";
import { AbcResult } from "./AbcResult";
import { serverRecords } from "./shared/serverRecords";

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
  public static get configuredModels() {
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
  public static clear() {
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
   * Everything you wanted to know about this instance of the **ABC** API
   * but were afraid to ask. :)
   */
  get about() {
    return {
      /** the `Model`'s name in different contexts */
      model: this._modelName,
      /** The meta infomation associated with the `Model` */
      modelMeta: this._modelMeta,
      /** the ABC API's configuration */
      config: this._config,
      dbOffset: this._dbOffset,
      dynamicPathComponents: this._dynamicPathComponents
    };
  }

  get modelConstructor() {
    return this._modelConstructor;
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
    request: IAbcConfiguredQuery<T> | IAbcDiscreteRequest<T>,
    options: IAbcOptions<T> = {}
  ): Promise<AbcResult<T>> {
    if (isDiscreteRequest(request)) {
      return this.getDiscrete(request, options);
    } else {
      // return request("get", options, this);
    }
  }

  /**
   * Handles GET requests for Discrete ID requests
   */
  private async getDiscrete(
    request: IAbcDiscreteRequest<T>,
    options: IAbcOptions<T> = {}
  ): Promise<AbcResult<T>> {
    const requestIds = request.map(i =>
      Record.compositeKeyRef(this._modelConstructor, i)
    );
    const local = await localRecords("get", requestIds, options, this);
    this._cacheHits += local.cacheHits;
    this._cacheMisses += local.cacheMisses;

    if (local.cacheHits === 0) {
      // No results locally
      store.commit(
        `${local.vuexModuleName}/${AbcMutation.ABC_NO_CACHE}`,
        local
      );
    } else if (this.config.useIndexedDb) {
      // Using IndexedDB
      if (local.foundExclusivelyInIndexedDb) {
        store.commit(
          `${local.vuexModuleName}/${AbcMutation.ABC_LOCAL_CACHE_UPDATE}`,
          local
        );
      } else {
        store.commit(
          `${local.vuexModuleName}/${AbcMutation.ABC_INDEXED_SKIPPED}`,
          local
        );
      }
    }

    if (local.allFoundLocally) {
      return new AbcResult(this, { local });
    }

    const server = await serverRecords("get", this, local.missing, requestIds);

    // update Vuex with server results
    store.commit(`${local.vuexModuleName}/${AbcMutation.ABC_SERVER_UPDATE}`, {
      local,
      server
    });

    // cache results to IndexedDB
    if (this.config.useIndexedDb) {
      const waitFor: any[] = [];
      server.records.forEach(record => {
        waitFor.push(this.dexieTable.put(record));
      });
      await Promise.all(waitFor);
      store.commit(
        `${local.vuexModuleName}/${AbcMutation.ABC_INDEXED_UPDATED}`,
        server
      );
    }

    return new AbcResult(this, { local, server });
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

  /**
   * Provides access to this `Model`'s Dexie **Table API**
   */
  get dexieTable() {
    return this.dexie.table(this._modelConstructor);
  }

  /**
   * Provides access to this `Model`'s Dexie **Record API**
   */
  get dexieRecord() {
    return this.dexie.record(this._modelConstructor);
  }

  /**
   * Provides access to this `Model`'s Dexie **List API**
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

  async connectDexie() {
    return AbcApi.connectIndexedDb();
  }

  /**
   * Load records using the **ABC** API
   *
   * @request either a Query Helper (since, where, etc.) or an array of primary keys
   */
  async load(
    request: IAbcConfiguredQuery<T> | IAbcDiscreteRequest<T>,
    options: IAbcOptions<T> = {}
  ) {
    if (isDiscreteRequest(request)) {
      return localRecords("load", request, options, this);
    } else {
      return request("load", options, this);
    }
  }

  /**
   * Watch records using the **ABC** API
   */
  async watch() {
    return [];
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
