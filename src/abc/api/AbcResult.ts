import { Model, Record } from "firemodel";
import { arrayToHash, hashToArray } from "typed-conversions";

import { AbcApi } from "@/abc";
import { AbcError } from "@/errors";
import { IAbcResult, ICachePerformance } from "@/types";
import { IDictionary } from "common-types";

/**
 * Whenever the `api.get()` or `api.load()` calls return they will
 * respond with this class. The classes goal is to pass back not only
 * the result but also certain meta data and a simple means to conditionally
 * watch certain elements of the returned resultset.
 */
export class AbcResult<T extends Model> {
  constructor(
    private _context: AbcApi<T>,
    private _results: IAbcResult<T>,
    private _performance?: IDictionary
  ) {}

  /**
   * Static initializer for `AbcResult` which
   *
   * @param _context
   * @param _results
   * @param _performance
   */
  static async create<T extends Model>(
    _context: AbcApi<T>,
    _results: IAbcResult<T>,
    _performance?: IDictionary
  ) {
    const obj = new AbcResult(_context, _results, _performance);
    if (!Array.isArray(obj.serverRecords) || !obj.serverRecords.length) {
      obj.records = obj.localRecords;
      return obj;
    }

    // Models with dynamic paths
    const hasDynamicProperties =
      Record.dynamicPathProperties(obj._context.model.constructor).length > 0;
    if (hasDynamicProperties) {
      let localPathProps = Record.compositeKey(
        obj._context.model.constructor,
        obj.serverRecords[0]
      );
      delete localPathProps.id;

      const propKeys = Object.keys(localPathProps);
      const propValues: string[] = Object.values(localPathProps);
      const whereClause = propKeys.length > 1 ? propKeys : propKeys.toString();
      const notEqualVal =
        propValues.length > 1 ? propValues : propValues.toString();

      const queryResults = await obj._context.dexieTable
        .where(whereClause)
        .notEqual(notEqualVal)
        .toArray();

      const localOffDynamicPath = arrayToHash(queryResults);

      const server = arrayToHash(obj.serverRecords || []);
      obj.records = hashToArray({ ...localOffDynamicPath, ...server });
    } else {
      obj.records =
        obj.serverRecords !== undefined ? obj.serverRecords : obj.localRecords;
    }

    return obj;
  }

  /**
   * All of the updated records in Vuex that originated from either IndexedDB or Firebase
   */
  records: T[] = [];

  /**
   * Boolean flag to indicate that the result came from a query (instead of a discrete request)
   */
  get resultFromQuery(): boolean {
    // TODO: we will add the correct option to the AbcResult constructor later
    return this._results.type === "query";
  }

  /**
   * All of the updated records in Vuex that originated from IndexedDB
   */
  get localRecords(): T[] {
    if (this._results.type !== "watch") {
      return this._results.local?.records || [];
    }
    return [];
  }

  /**
   * All of the updated records in Vuex that originated from Firebase
   */
  get serverRecords(): T[] | undefined {
    return this._results.server?.records || undefined;
  }

  get cachePerformance(): ICachePerformance {
    return this._context.cachePerformance;
  }

  get requestPerformance() {
    return this._performance;
  }

  get vuex() {
    return this._context.vuex;
  }

  get dynamicPathComponents() {
    return this._context.about.dynamicPathComponents;
  }

  /**
   * The options passed in for the specific request which led to this result
   */
  get options() {
    return this._results.options;
  }

  get query() {
    if (this._results.type !== "query") {
      return;
    }
    return this._results.server?.query;
  }

  /** the query definition used to arrive at these results */
  get queryDefn() {
    if (this._results.type !== "query") {
      throw new AbcError(
        `The attempt to reference the result's "queryDefn" is invalid in non-query based results!`,
        "not-allowed"
      );
    }

    return this._results.queryDefn;
  }
}
