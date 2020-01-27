import { Model, Record, IFmModelMeta, FireModel, DexieDb } from "firemodel";
import { IAbcApiConfig, IAbcDiscreteRequest, IAbcConfiguredQuery, IAbcOptions, isDiscreteRequest } from "../../types/abc";
import { getDefaultApiConfig } from "../configuration/configApi";
import { removeProperty, capitalize } from "../../shared";
import { IDictionary } from "firemock";
import { IFmModelConstructor } from "../../types";
import { AbcError } from "../../errors";
import { retrieveKeys } from "./api-parts/get";
import { DB } from "abstracted-client";

/**
 * Provides the full **ABC** API, including `get`, `load`, and `watch` but also 
 * including meta-data properties too.
 */
export class AbcApi<T extends Model> {
  /**
   * keeps tabs on all of the `Model`'s which have been configured
   * for the **ABC** API.
   */
  private static _modelsManaged: IDictionary<AbcApi<any>> = {}

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
      throw new AbcError(`You have attempted to register the model ${modelName} twice!`, `abc-api/invalid-model-registration`)
    }

    AbcApi._modelsManaged[modelName] = model;

    return model;
  }

  /**
   * Returns a list of `Model`'s that have been configured
   * for use with the **ABC** API.
   */
  public static get configuredModels() {
    return Object.keys(AbcApi._modelsManaged)
  }

  /**
   * Returns constructors for the `Model`s which will be managed by the IndexedDB
   */
  protected static get indexedDbModelConstructors(): IFmModelConstructor<any>[] {
    return Object.keys(AbcApi._modelsManaged)
      .filter(m => AbcApi.getModelApi(m).config.useIndexedDb)
      .map(m => AbcApi.getModelApi(m)._modelConstructor)
  }

  /**
   * returns an `AbcApi` instance for a given `Model`
   */
  public static getModelApi(name: string) {
    if (!AbcApi._modelsManaged[name]) {
      throw new AbcError(`You attempted to get an AbcApi for the model ${name} but it is not yet configured!`, 'abc-api/invalid-model')
    }
    return AbcApi._modelsManaged[name]
  }

  /**
   * Clears the **ABC** API from all models that are being managed and disconnects for IndexedDB
   */
  public static clear() {
    AbcApi._modelsManaged = {}
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
      console.info('ABC API has no models using IndexedDB');
    }
  }

  private _config: IAbcApiConfig<T>
  private _modelConstructor: IFmModelConstructor<T>
  // MODEL INFO
  private _dbOffset: string;
  private _dynamicPathComponents: (keyof T & string)[] | false;
  private _modelName: { singular: string, plural: string, pascal: string };
  private _modelMeta: IFmModelMeta<T>
  // CACHE STATS
  private _cacheHits: number = 0;
  private _cacheMisses: number = 0;
  private _cacheIgnores: number = 0;

  constructor(model: IFmModelConstructor<T>, config: IAbcApiConfig<T> = {}) {
    if (!config.db && FireModel.defaultDb) {
      throw new AbcError(`You must provide a way to access the database before you instantiate the ABC API! You can pass it in explicitly as a part of the config or it will pickup the FireModel.defaultDb if that's available.`, 'not-ready')
    }
    this._modelConstructor = model;
    this._config = { ...getDefaultApiConfig(), ...config }
    const rec = Record.create(this._modelConstructor);
    this._dynamicPathComponents = rec.hasDynamicPath ? rec.dynamicPathComponents : false;
    this._dbOffset = rec.dbOffset;
    this._modelName = { singular: rec.modelName, plural: rec.pluralName, pascal: capitalize(rec.modelName) };
    this._modelMeta = rec.META
    AbcApi.addModel(this)
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
      dynamicPathComponents: this._dynamicPathComponents,
    }
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
    }
  }

  /**
   * Get records using the **ABC** API. 
   * 
   * @request either a Query Helper (since, where, etc.) or an array of primary keys
   */
  async get(request: IAbcConfiguredQuery<T> | IAbcDiscreteRequest<T>, options: IAbcOptions<T> = {}): Promise<T[]> {

    if (isDiscreteRequest(request)) {
      return retrieveKeys('get', request, options, this)
    } else {
      return request('get', options, this);
    }

  }

  /**
   * Provides access to the Firebase database
   */
  get db() {
    const db = this.config.db || FireModel.defaultDb;
    if (!db) {
      throw new AbcError(`Attempt to access the database via the db getter failed which means that the ABC API was not given a database connector and there is no "defaultDb" set with Firemodel.`)
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
    return AbcApi._dexieDb;
  }

  /**
   * Load records using the **ABC** API
   * 
   * @request either a Query Helper (since, where, etc.) or an array of primary keys
   */
  async load(request: IAbcConfiguredQuery<T> | IAbcDiscreteRequest<T>, options: IAbcOptions<T> = {}) {

    if (isDiscreteRequest(request)) {
      return retrieveKeys('load', request, options, this)
    } else {
      return request('load', options, this);
    }

  }

  /**
   * Watch records using the **ABC** API
   */
  async watch() {
    return []
  }



  toJSON() {
    return {
      model: this.about.model.pascal,
      config: this.about.config,
      cachePerformance: this.cachePerformance
    }
  }
  toString() {
    return `ABC API for the "${this.about.model.pascal}" model [ cache: ${this.cachePerformance.hits}/${this.cachePerformance.misses} ]`
  }
}
