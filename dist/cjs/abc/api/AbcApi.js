"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firemodel_1 = require("firemodel");
const abc_1 = require("../../types/abc");
const configApi_1 = require("../configuration/configApi");
const shared_1 = require("../../shared");
const errors_1 = require("../../errors");
const get_1 = require("./api-parts/get");
/**
 * Provides the full **ABC** API, including `get`, `load`, and `watch` but also
 * including meta-data properties too.
 */
class AbcApi {
    constructor(model, config = {}) {
        // CACHE STATS
        this._cacheHits = 0;
        this._cacheMisses = 0;
        this._cacheIgnores = 0;
        if (!config.db && firemodel_1.FireModel.defaultDb) {
            throw new errors_1.AbcError(`You must provide a way to access the database before you instantiate the ABC API! You can pass it in explicitly as a part of the config or it will pickup the FireModel.defaultDb if that's available.`, 'not-ready');
        }
        this._modelConstructor = model;
        this._config = Object.assign(Object.assign({}, configApi_1.getDefaultApiConfig()), config);
        const rec = firemodel_1.Record.create(this._modelConstructor);
        this._dynamicPathComponents = rec.hasDynamicPath ? rec.dynamicPathComponents : false;
        this._dbOffset = rec.dbOffset;
        this._modelName = { singular: rec.modelName, plural: rec.pluralName, pascal: shared_1.capitalize(rec.modelName) };
        this._modelMeta = rec.META;
        AbcApi.addModel(this);
    }
    /**
     * Boolean flag which indicates whether the IndexedDB is connected
     * for use with the **ABC** API.
     */
    static get indexedDbConnected() {
        return AbcApi._dexieDb && AbcApi._dexieDb.isOpen() ? true : false;
    }
    /**
     * Adds a model to the managed models dictionary that AbcApi manages.
     */
    static addModel(model) {
        const modelName = model.about.model.pascal;
        if (AbcApi._modelsManaged[modelName]) {
            throw new errors_1.AbcError(`You have attempted to register the model ${modelName} twice!`, `abc-api/invalid-model-registration`);
        }
        AbcApi._modelsManaged[modelName] = model;
        return model;
    }
    /**
     * Returns a list of `Model`'s that have been configured
     * for use with the **ABC** API.
     */
    static get configuredModels() {
        return Object.keys(AbcApi._modelsManaged);
    }
    /**
     * Returns constructors for the `Model`s which will be managed by the IndexedDB
     */
    static get indexedDbModelConstructors() {
        return Object.keys(AbcApi._modelsManaged)
            .filter(m => AbcApi.getModelApi(m).config.useIndexedDb)
            .map(m => AbcApi.getModelApi(m)._modelConstructor);
    }
    /**
     * returns an `AbcApi` instance for a given `Model`
     */
    static getModelApi(name) {
        if (!AbcApi._modelsManaged[name]) {
            throw new errors_1.AbcError(`You attempted to get an AbcApi for the model ${name} but it is not yet configured!`, 'abc-api/invalid-model');
        }
        return AbcApi._modelsManaged[name];
    }
    /**
     * Clears the **ABC** API from all models that are being managed and disconnects for IndexedDB
     */
    static clear() {
        AbcApi._modelsManaged = {};
        if (AbcApi.indexedDbConnected) {
            AbcApi.disconnect();
        }
    }
    static disconnect() {
        return AbcApi._dexieDb.close();
    }
    /**
     * Connects to the IndexedDB; using all the models the ABC API knows
     * about (and which have been configured to use IndexedDB)
     */
    static async connectIndexedDb() {
        const models = AbcApi.indexedDbModelConstructors;
        if (models.length > 0) {
            AbcApi._dexieDb = new firemodel_1.DexieDb(`ABC-API`, ...models);
            if (!AbcApi._dexieDb.isOpen()) {
                await AbcApi._dexieDb.open();
            }
        }
        else {
            console.info('ABC API has no models using IndexedDB');
        }
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
    async get(request, options = {}) {
        if (abc_1.isDiscreteRequest(request)) {
            return get_1.retrieveKeys('get', request, options, this);
        }
        else {
            return request('get', options, this);
        }
    }
    /**
     * Provides access to the Firebase database
     */
    get db() {
        const db = this.config.db || firemodel_1.FireModel.defaultDb;
        if (!db) {
            throw new errors_1.AbcError(`Attempt to access the database via the db getter failed which means that the ABC API was not given a database connector and there is no "defaultDb" set with Firemodel.`);
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
    get dexie() {
        return AbcApi._dexieDb;
    }
    /**
     * Load records using the **ABC** API
     *
     * @request either a Query Helper (since, where, etc.) or an array of primary keys
     */
    async load(request, options = {}) {
        if (abc_1.isDiscreteRequest(request)) {
            return get_1.retrieveKeys('load', request, options, this);
        }
        else {
            return request('load', options, this);
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
exports.AbcApi = AbcApi;
/**
 * keeps tabs on all of the `Model`'s which have been configured
 * for the **ABC** API.
 */
AbcApi._modelsManaged = {};
//# sourceMappingURL=AbcApi.js.map