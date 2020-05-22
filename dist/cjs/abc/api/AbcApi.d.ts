import { Model, IFmModelMeta, DexieDb, IPrimaryKey } from "firemodel";
import { IAbcApiConfig, IAbcOptions, IAbcParam, AbcResult, IFmModelConstructor } from "../../private";
/**
 * Provides the full **ABC** API, including `get`, `load`, and `watch` but also
 * including meta-data properties too.
 */
export declare class AbcApi<T extends Model> {
    /**
     * keeps tabs on all of the `Model`'s which have been configured
     * for the **ABC** API.
     */
    private static _modelsManaged;
    /**
     * The connection to the IndexedDB is not done until the first
     * get/load command is executed. At this point the ABC API will
     * connect to IndexedDB and keep this connection open for all
     * subsequent calls.
     */
    private static _dexieDb;
    /**
     * Boolean flag which indicates whether the IndexedDB is connected
     * for use with the **ABC** API.
     */
    static get indexedDbConnected(): boolean;
    /**
     * Adds a model to the managed models dictionary that AbcApi manages.
     */
    static addModel(model: AbcApi<any>): AbcApi<any>;
    /**
     * Returns a list of `Model`'s that have been configured
     * for use with the **ABC** API.
     */
    static get configuredFiremodelModels(): string[];
    /**
     * Returns constructors for the `Model`s which will be managed by the IndexedDB
     */
    protected static get indexedDbModelConstructors(): IFmModelConstructor<any>[];
    /**
     * returns an `AbcApi` instance for a given `Model`
     */
    static getModelApi<T extends Model>(model: IFmModelConstructor<T>): AbcApi<T>;
    /**
     * Clears the **ABC** API from all models that are being managed and disconnects for IndexedDB
     */
    static clear(): Promise<void>;
    static disconnect(): void;
    /**
     * Connects to the IndexedDB; using all the models the ABC API knows
     * about (and which have been configured to use IndexedDB)
     */
    static connectIndexedDb(): Promise<void>;
    private _config;
    private _modelConstructor;
    private _dbOffset;
    private _dynamicPathComponents;
    private _modelName;
    private _modelMeta;
    private _cacheHits;
    private _cacheMisses;
    private _cacheIgnores;
    cacheHits(hits: number): void;
    cacheMisses(misses: number): void;
    constructor(model: IFmModelConstructor<T>, config?: IAbcApiConfig<T>);
    /**
     * Different naming conventions for the model along with the model's
     * constructor
     */
    get model(): {
        constructor: IFmModelConstructor<T>;
        singular: string;
        plural: string;
        pascal: string;
    };
    /**
     * Everything you wanted to know about this instance of the **ABC** API
     * but were afraid to ask. :)
     */
    get about(): {
        /**
         * Different naming conventions for the model along with the model's
         * constructor
         */
        model: {
            constructor: IFmModelConstructor<T>;
            singular: string;
            plural: string;
            pascal: string;
        };
        /** The meta infomation associated with the `Model` */
        modelMeta: IFmModelMeta<T>;
        /** the ABC API's configuration */
        config: IAbcApiConfig<T>;
        dbOffset: string;
        dynamicPathComponents: false | (keyof T & string)[];
    };
    /**
     * Information about the Vuex location
     */
    get vuex(): {
        /**
         * Indicates whether this module has been configured as a _list_
         * or a _record_.
         */
        isList: boolean | undefined;
        /**
         * Path to the root of the module
         */
        modulePath: string;
        /**
         * The name of the Vuex module who's state
         * is being queried
         */
        moduleName: string;
        /**
         * An optional offset to the module to store record(s)
         */
        modulePostfix: string;
        /**
         * The full path to where the record(s) reside
         */
        fullPath: string;
    };
    /**
     * Look at the performance of caching of your data for
     * the given `Model`
     */
    get cachePerformance(): {
        /** results found in IndexedDB */
        hits: number;
        /** had to go to Firebase for results */
        misses: number;
        /** ignored the request as results were already in Vuex */
        ignores: number;
    };
    /**
     * Get records using the **ABC** API.
     *
     * @request either a Query Helper (since, where, etc.) or an array of primary keys
     */
    get(request: IAbcParam<T>, options?: IAbcOptions<T>): Promise<AbcResult<T>>;
    /**
     * Load records using the **ABC** API
     *
     * @request either a Query Helper (since, where, etc.) or an array of primary keys
     */
    load(request: IAbcParam<T>, options?: IAbcOptions<T>): Promise<AbcResult<T>>;
    private getQuery;
    private loadQuery;
    /**
     * Handles GET requests for Discrete ID requests
     */
    private getDiscrete;
    /**
     * Handles LOAD requests for Discrete ID requests
     */
    private loadDiscrete;
    get hasDynamicProperties(): boolean;
    /**
     * Provides access to the Firebase database
     */
    get db(): import("@forest-fire/real-time-client").RealTimeClient | import("@forest-fire/abstracted-database").AbstractedDatabase;
    /**
     * The **ABC** configuration for this instance's `Model`
     */
    get config(): IAbcApiConfig<T>;
    get dexieModels(): {
        name: string;
        schema: import("dexie").TableSchema;
    }[];
    /**
     * Provides access to this Dexie **Table API**
     */
    get dexieTable(): import("dexie").Dexie.Table<T, IPrimaryKey<T>>;
    /**
     * Provides access to this Dexie **Record API**
     */
    get dexieRecord(): import("firemodel").DexieRecord<T>;
    /**
     * Provides access to this Dexie **List API**
     */
    get dexieList(): import("firemodel").DexieList<T>;
    protected get dexie(): DexieDb;
    /**
     * Connects Dexie to IndexedDB for _all_ Firemodel Models
     */
    connectDexie(): Promise<void>;
    /**
     * Watch records using the **ABC** API
     */
    watch(): Promise<never[]>;
    toJSON(): {
        model: string;
        config: IAbcApiConfig<T>;
        cachePerformance: {
            /** results found in IndexedDB */
            hits: number;
            /** had to go to Firebase for results */
            misses: number;
            /** ignored the request as results were already in Vuex */
            ignores: number;
        };
    };
    toString(): string;
}
