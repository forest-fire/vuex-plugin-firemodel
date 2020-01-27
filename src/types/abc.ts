import { IFmModelConstructor } from "./config";
import { Model, IPrimaryKey } from "firemodel";
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
  db?: DB
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
  watch?: IAbcPostWatcher<T>
  watchNew?: boolean
  /**
   * If you are using a Query Helper you can state that you
   * want to have ALL locally cached state in IndexedDB
   */
  allLocally?: boolean
}

/**
 * Recieves a _list_ of type T and returns either the same
 * list or a subset of it.
 */
export interface IAbcPostWatcher <T extends Model>{
  (results: T[]): T[]
}

/** An **ABC** request for discrete primary keys */
export type IAbcDiscreteRequest<T extends Model> = IPrimaryKey<T>[]

/** An **ABC** request for records using a Query Helper */
export interface IAbcQueryRequest<T extends Model> {
  (query: IAbcQueryHelper<T>, options?: IAbcOptions<T>): IAbcConfiguredQuery<T>
} 

export function isDiscreteRequest<T>(request: IAbcDiscreteRequest<T> | IAbcConfiguredQuery<T>): request is IAbcDiscreteRequest<T> {
  return typeof request !== 'function'
}

/** The specific **ABC** request command */
export type AbcRequestCommand = 'get' | 'load'

/** 
 * once the consumer has configured a helper query it must still be passed
 * additional context by the `AbcApi` to help complete the task.
 */
export interface IAbcConfiguredQuery<T> {
  (command: AbcRequestCommand, options: IAbcOptions<T>, context: AbcApi<T>): Promise<T[]>
}