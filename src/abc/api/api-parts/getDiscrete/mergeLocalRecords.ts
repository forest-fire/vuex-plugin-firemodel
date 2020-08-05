import { Record, pk } from "firemodel";
import { arrayToHash, hashToArray } from "typed-conversions";

import { AbcApi } from "@/abc";
import { IDiscreteLocalResults } from "@/types";

/**
 * Calculates the delta between Indexed DB and Vuex
 */
export function mergeLocalRecords<T>(
  context: AbcApi<T>,
  idxRecords: T[],
  vuexRecords: T[],
  requestPks: pk[]
) {
  const model = context.model.constructor;
  const vuexPks = vuexRecords.map(v => Record.compositeKeyRef(model, v));
  const idxPks = idxRecords.map(i => Record.compositeKeyRef(model, i));

  const localIds = Array.from(
    new Set<string>([...vuexPks, ...idxPks])
  );

  const missingIds = requestPks.filter(pk => !localIds.includes(pk));

  let local: IDiscreteLocalResults<T> = {
    cacheHits: localIds.length,
    cacheMisses: missingIds.length,
    foundInIndexedDb: idxPks,
    foundInVuex: vuexPks,
    foundExclusivelyInIndexedDb: idxPks.filter(i => !vuexPks.includes(i)),
    allFoundLocally: missingIds.length === 0 ? true : false,
    records: hashToArray({
      ...arrayToHash(vuexRecords),
      ...arrayToHash(idxRecords)
    }),
    missing: missingIds,
    modelConfig: context.config,
    overallCachePerformance: context.cachePerformance
  };

  context.cacheHits(local.cacheHits);
  context.cacheMisses(local.cacheMisses);

  return local;
}
