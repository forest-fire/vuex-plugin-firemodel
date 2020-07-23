import { IAbcPayload } from "@/types";
import { AbcResult } from "@/abc";

/**
 * Converts an `AbcResult` object to a more minimal `IAbcPayload` to pass through
 * to Vuex
 */
export function abcPayload<T>(result: AbcResult<T>): IAbcPayload<T> {
  const { records, cachePerformance, query, vuex, resultFromQuery } = result;

  return {
    records,
    cachePerformance,
    query: query?.identity,
    localPath: vuex.moduleName,
    totalRecords: records.length,
    isList: vuex.isList,
    isQuery: resultFromQuery
  };
}
