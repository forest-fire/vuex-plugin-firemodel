import { List, Model, Record, pk } from "firemodel";

import { AbcApi } from "@/abc";
import type { IDiscreteServerResults } from "@/types";

export async function serverRecords<T extends Model>(
  context: AbcApi<T>,
  pks: pk[],
  allPks: pk[]
): Promise<IDiscreteServerResults<T>> {
  const records = (await List.ids(context.model.constructor, ...pks)).data;
  const recordIds = records.map(i =>
    Record.compositeKeyRef(context.model.constructor, i)
  );
  const missing = pks.filter(i => !recordIds.includes(i));

  return {
    pks,
    allPks,
    missing,
    records,

    overallCachePerformance: context.cachePerformance,

    modelConfig: context.config
  };
}
