import { Model, IFmModelMeta, DexieDb } from "firemodel";
import { IAbcApiConfig, IAbcDiscreteRequest, IAbcConfiguredQuery, IAbcOptions } from "../../types/abc";
import { IFmModelConstructor } from "../../types";
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
    static get configuredModels(): string[];
    /**
     * Returns constructors for the `Model`s which will be managed by the IndexedDB
     */
    protected static get indexedDbModelConstructors(): IFmModelConstructor<any>[];
    /**
     * returns an `AbcApi` instance for a given `Model`
     */
    static getModelApi(name: string): AbcApi<any>;
    /**
     * Clears the **ABC** API from all models that are being managed and disconnects for IndexedDB
     */
    static clear(): void;
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
    constructor(model: IFmModelConstructor<T>, config?: IAbcApiConfig<T>);
    /**
     * Everything you wanted to know about this instance of the **ABC** API
     * but were afraid to ask. :)
     */
    get about(): {
        /** the `Model`'s name in different contexts */
        model: {
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
    get(request: IAbcConfiguredQuery<T> | IAbcDiscreteRequest<T>, options?: IAbcOptions<T>): Promise<T[]>;
    /**
     * Provides access to the Firebase database
     */
    get db(): import("abstracted-firebase").RealTimeDB<any>;
    /**
     * The **ABC** configuration for this instance's `Model`
     */
    get config(): IAbcApiConfig<T>;
    /**
   * Provides access to this `Model`'s Dexie **Table API**
   */
    get dexieTable(): import("dexie").Dexie.Table<T, import("firemodel").IPrimaryKey<T>>;
    /**
     * Provides access to this `Model`'s Dexie **Record API**
     */
    get dexieRecord(): import("firemodel").DexieRecord<T>;
    /**
     * Provides access to this `Model`'s Dexie **List API**
     */
    get dexieList(): import("firemodel").DexieList<T>;
    protected get dexie(): DexieDb;
    /**
     * Load records using the **ABC** API
     *
     * @request either a Query Helper (since, where, etc.) or an array of primary keys
     */
    load(request: IAbcConfiguredQuery<T> | IAbcDiscreteRequest<T>, options?: IAbcOptions<T>): Promise<T[]>;
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
