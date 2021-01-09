import { IPrimaryKey, Record } from "firemodel";
import { arrayToHash, hashToArray } from "typed-conversions";

import { AbcApi } from "@/abc";
import type { IDiscreteLocalResults } from "@/types";

export function mergeLocalRecords<T>(
  context: AbcApi<T>,
  idxRecords: T[],
  vuexRecords: T[],
  requestPks: IPrimaryKey<T>[]
) {
  const model = context.model.constructor;
  const vuexPks = vuexRecords.map(v => Record.compositeKeyRef(model, v));
  const idxPks = idxRecords.map(i => Record.compositeKeyRef(model, i));

  const localIds = Array.from(
    new Set<string>([...vuexPks, ...idxPks])
  );

  const missingIds = requestPks
    .map(pk =>
      typeof pk === "string" ? pk : Record.create(model, pk).compositeKeyRef
    )
    .filter(pk => !localIds.includes(pk));

  const results = {
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
    modelConfig: context.config
  };

  let local: IDiscreteLocalResults<T> | undefined = undefined;
  if (results) {
    context.cacheHits(results.cacheHits);
    context.cacheMisses(results.cacheMisses);
    local = {
      ...results,
      overallCachePerformance: context.cachePerformance
    };
  }

  return local;
}
