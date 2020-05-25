"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbcApi = void 0;
const private_1 = require("../../private");
const firemodel_1 = require("firemodel");
const common_types_1 = require("common-types");
/**
 * Provides the full **ABC** API, including `get`, `load`, and `watch` but also
 * including meta-data properties too.
 */
let AbcApi = /** @class */ (() => {
    class AbcApi {
        constructor(model, config = {}) {
            // CACHE STATS
            this._cacheHits = 0;
            this._cacheMisses = 0;
            this._cacheIgnores = 0;
            // if (!config.db && FireModel.defaultDb) {
            //   throw new AbcError(`You must provide a way to access the database before you instantiate the ABC API! You can pass it in explicitly as a part of the config or it will pickup the FireModel.defaultDb if that's available.`, 'not-ready')
            // }
            this._modelConstructor = model;
            this._config = Object.assign(Object.assign({}, private_1.getDefaultApiConfig()), config);
            const rec = firemodel_1.Record.create(this._modelConstructor);
            this._dynamicPathComponents = rec.hasDynamicPath
                ? rec.dynamicPathComponents
                : false;
            this._dbOffset = rec.dbOffset;
            this._modelName = {
                singular: rec.modelName,
                plural: rec.pluralName,
                pascal: private_1.capitalize(rec.modelName)
            };
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
                throw new private_1.AbcError(`You have attempted to register the model ${modelName} twice!`, `abc-api/invalid-model-registration`);
            }
            AbcApi._modelsManaged[modelName] = model;
            return model;
        }
        /**
         * Returns a list of `Model`'s that have been configured
         * for use with the **ABC** API.
         */
        static get configuredFiremodelModels() {
            return Object.keys(AbcApi._modelsManaged);
        }
        /**
         * Returns constructors for the `Model`s which will be managed by the IndexedDB
         */
        static get indexedDbModelConstructors() {
            return Object.keys(AbcApi._modelsManaged)
                .filter(m => AbcApi._modelsManaged[m].config.useIndexedDb)
                .map(m => AbcApi._modelsManaged[m]._modelConstructor);
        }
        /**
         * returns an `AbcApi` instance for a given `Model`
         */
        static getModelApi(model) {
            const r = firemodel_1.Record.create(model);
            const name = private_1.capitalize(r.modelName);
            if (!AbcApi._modelsManaged[name]) {
                throw new private_1.AbcError(`You attempted to get an AbcApi for the model ${name} but it is not yet configured!`, "abc-api/invalid-model");
            }
            return AbcApi._modelsManaged[name];
        }
        /**
         * Clears the **ABC** API from all models that are being managed and disconnects for IndexedDB
         */
        static async clear() {
            const waitFor = [];
            Object.keys(AbcApi._modelsManaged).forEach(key => {
                const ref = AbcApi.getModelApi(AbcApi._modelsManaged[key].model.constructor);
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
                console.info("ABC API has no models using IndexedDB");
            }
        }
        cacheHits(hits) {
            this._cacheHits += hits;
        }
        cacheMisses(misses) {
            this._cacheMisses += misses;
        }
        /**
         * Different naming conventions for the model along with the model's
         * constructor
         */
        get model() {
            return Object.assign(Object.assign({}, this._modelName), { constructor: this._modelConstructor });
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
                    : this.about.modelMeta.localModelName),
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
                    ? common_types_1.pathJoin(this.model.plural, this._modelMeta.localPostfix || "all")
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
        async get(request, options = {}) {
            if (private_1.isDiscreteRequest(request)) {
                return this.getDiscrete(request, options);
            }
            else {
                return this.getQuery(request, options);
            }
        }
        /**
         * Load records using the **ABC** API
         *
         * @request either a Query Helper (since, where, etc.) or an array of primary keys
         */
        async load(request, options = {}) {
            if (private_1.isDiscreteRequest(request)) {
                return this.loadDiscrete(request, options);
            }
            else {
                return this.loadQuery(request, options);
            }
        }
        async getQuery(request, options = {}) {
            const store = private_1.getStore();
            // query types all() | where() | since()
            const { dexieQuery, firemodelQuery, queryDefn } = request(this, options);
            let local = {
                records: [],
                indexedDbPks: [],
                localPks: [],
            };
            // query indexedDb
            if (this.config.useIndexedDb) {
                // ctx should be model constructor
                local = await private_1.queryIndexedDb(this._modelConstructor, dexieQuery);
                const localResults = await private_1.AbcResult.create(this, {
                    type: "query",
                    queryDefn,
                    local,
                    options
                });
                if (local.records.length > 0) {
                    if (this.hasDynamicProperties) {
                        store.commit(`${this.vuex.moduleName}/${private_1.DbSyncOperation.ABC_INDEXED_DB_SET_DYNAMIC_PATH_VUEX}`, localResults);
                    }
                    else {
                        store.commit(`${this.vuex.moduleName}/${private_1.DbSyncOperation.ABC_INDEXED_DB_SET_VUEX}`, localResults);
                    }
                }
                else {
                    store.commit(`${this.vuex.moduleName}/${private_1.AbcMutation.ABC_LOCAL_QUERY_EMPTY}`, localResults);
                }
            }
            // query firebase if getFirebase strategy in place
            let server;
            if (options.strategy === private_1.AbcStrategy.getFirebase) {
                // get data from firebase
                private_1.queryFirebase(this, firemodelQuery, local).then(async (server) => {
                    const serverResponse = await private_1.AbcResult.create(this, {
                        type: "query",
                        queryDefn,
                        local,
                        server,
                        options
                    });
                    // cache results to IndexedDB
                    if (this.config.useIndexedDb) {
                        private_1.saveToIndexedDb(server, this.dexieTable);
                        if (this.hasDynamicProperties) {
                            // check queryType to determine what to do
                            switch (queryDefn.queryType) {
                                case private_1.QueryType.since:
                                case private_1.QueryType.where:
                                    store.commit(`${this.vuex.moduleName}/${private_1.DbSyncOperation.ABC_FIREBASE_MERGE_INDEXED_DB}`, serverResponse);
                                    break;
                                case private_1.QueryType.all:
                                    store.commit(`${this.vuex.moduleName}/${private_1.DbSyncOperation.ABC_FIREBASE_SET_DYNAMIC_PATH_INDEXED_DB}`, serverResponse);
                                    break;
                            }
                        }
                        else {
                            store.commit(`${this.vuex.moduleName}/${private_1.DbSyncOperation.ABC_FIREBASE_SET_INDEXED_DB}`, serverResponse);
                        }
                    }
                    store.commit(`${this.vuex.moduleName}/${private_1.DbSyncOperation.ABC_INDEXED_DB_SET_VUEX}`, serverResponse);
                });
            }
            const response = await private_1.AbcResult.create(this, {
                type: "query",
                queryDefn,
                local,
                server,
                options
            });
            return response;
        }
        async loadQuery(request, options = {}) {
            const store = private_1.getStore();
            // query types all() | where() | since()
            const { firemodelQuery, queryDefn } = request(this, options);
            let local = {
                records: [],
                indexedDbPks: [],
                localPks: []
            };
            // query firebase if getFirebase strategy in place
            // get data from firebase
            const server = await private_1.queryFirebase(this, firemodelQuery, local);
            const serverResponse = await private_1.AbcResult.create(this, {
                type: "query",
                queryDefn,
                local,
                server,
                options
            });
            // cache results to IndexedDB
            if (this.config.useIndexedDb) {
                private_1.saveToIndexedDb(server, this.dexieTable);
                if (options.strategy === private_1.AbcStrategy.loadVuex) {
                    if (this.hasDynamicProperties) {
                        // check queryType to determine what to do
                        switch (queryDefn.queryType) {
                            case private_1.QueryType.since:
                            case private_1.QueryType.where:
                                store.commit(`${this.vuex.moduleName}/${private_1.DbSyncOperation.ABC_FIREBASE_MERGE_INDEXED_DB}`, serverResponse);
                                break;
                            case private_1.QueryType.all:
                                store.commit(`${this.vuex.moduleName}/${private_1.DbSyncOperation.ABC_FIREBASE_SET_DYNAMIC_PATH_INDEXED_DB}`, serverResponse);
                                break;
                        }
                    }
                    else {
                        store.commit(`${this.vuex.moduleName}/${private_1.DbSyncOperation.ABC_FIREBASE_SET_INDEXED_DB}`, serverResponse);
                    }
                    store.commit(`${this.vuex.moduleName}/${private_1.DbSyncOperation.ABC_INDEXED_DB_SET_VUEX}`, serverResponse);
                }
            }
            const response = await private_1.AbcResult.create(this, {
                type: "query",
                queryDefn,
                local,
                server,
                options
            });
            if (options.strategy === private_1.AbcStrategy.loadVuex) {
                store.commit(`${this.vuex.moduleName}/${private_1.DbSyncOperation.ABC_FIREBASE_SET_VUEX}`, response);
            }
            return response;
        }
        /**
         * Handles GET requests for Discrete ID requests
         */
        async getDiscrete(request, options = {}) {
            const store = private_1.getStore();
            let idxRecords = [];
            const requestIds = request.map(i => firemodel_1.Record.compositeKeyRef(this._modelConstructor, i));
            // get from Vuex
            const vuexRecords = await private_1.getFromVuex(this);
            if (this.config.useIndexedDb) {
                // get from indexedDB
                idxRecords = await private_1.getFromIndexedDb(this.dexieRecord, requestIds);
            }
            const local = private_1.mergeLocalRecords(this, idxRecords, vuexRecords, requestIds);
            // query firebase if getFirebase strategy in place
            let server;
            if (options.strategy === private_1.AbcStrategy.getFirebase) {
                // get from firebase
                private_1.getFromFirebase(this, requestIds).then(async (server) => {
                    const serverResponse = await private_1.AbcResult.create(this, {
                        type: "discrete",
                        local,
                        server,
                        options
                    });
                    // cache results to IndexedDB
                    if (this.config.useIndexedDb) {
                        // save to indexedDB
                        private_1.saveToIndexedDb(server, this.dexieTable);
                        store.commit(`${this.vuex.moduleName}/${private_1.DbSyncOperation.ABC_FIREBASE_MERGE_INDEXED_DB}`, serverResponse);
                    }
                    store.commit(`${this.vuex.moduleName}/${private_1.DbSyncOperation.ABC_FIREBASE_MERGE_VUEX}`, serverResponse);
                });
            }
            const response = await private_1.AbcResult.create(this, {
                type: "discrete",
                local,
                server,
                options
            });
            store.commit(`${this.vuex.moduleName}/${private_1.DbSyncOperation.ABC_INDEXED_DB_SET_VUEX}`, response);
            return response;
        }
        /**
         * Handles LOAD requests for Discrete ID requests
         */
        async loadDiscrete(request, options = {}) {
            const store = private_1.getStore();
            // const t0 = performance.now();
            const requestIds = request.map(i => firemodel_1.Record.compositeKeyRef(this._modelConstructor, i));
            const local = undefined;
            const server = await private_1.getFromFirebase(this, requestIds);
            const serverResponse = await private_1.AbcResult.create(this, {
                type: "discrete",
                local,
                server,
                options
            });
            // cache results to IndexedDB
            if (this.config.useIndexedDb) {
                // save to indexedDB
                await private_1.saveToIndexedDb(server, this.dexieTable);
                if (options.strategy === private_1.AbcStrategy.loadVuex) {
                    store.commit(`${this.vuex.moduleName}/${private_1.DbSyncOperation.ABC_FIREBASE_SET_INDEXED_DB}`, serverResponse);
                }
            }
            if (options.strategy === private_1.AbcStrategy.loadVuex) {
                // load data into vuex
                store.commit(`${this.vuex.moduleName}/${private_1.DbSyncOperation.ABC_FIREBASE_SET_VUEX}`, serverResponse);
            }
            // const perfOverall = t2 - t0;
            const results = await private_1.AbcResult.create(this, {
                type: "discrete",
                options,
                local,
                server
            });
            return results;
        }
        get hasDynamicProperties() {
            return firemodel_1.Record.dynamicPathProperties(this._modelConstructor).length > 0;
        }
        /**
         * Provides access to the Firebase database
         */
        get db() {
            const db = this.config.db || firemodel_1.FireModel.defaultDb;
            if (!db) {
                throw new private_1.AbcError(`Attempt to access the database via the db getter failed which means that the ABC API was not given a database connector and there is no "defaultDb" set with Firemodel.`);
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
        get dexie() {
            if (!this.about.config.useIndexedDb) {
                throw new private_1.AbcError(`You are attempting to access Dexie while connected to the ABC API with the model ${this.about.model.pascal} which is configured NOT to use IndexedDB!`, "not-allowed");
            }
            if (!AbcApi._dexieDb) {
                throw new private_1.AbcError(`The Dexie database is not yet connected; calls to get() or load() will automatically connect it but if you want to access it prior to that you must call connectDexie()`, "not-ready");
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
    /**
     * keeps tabs on all of the `Model`'s which have been configured
     * for the **ABC** API.
     */
    AbcApi._modelsManaged = {};
    return AbcApi;
})();
exports.AbcApi = AbcApi;
//# sourceMappingURL=AbcApi.js.map