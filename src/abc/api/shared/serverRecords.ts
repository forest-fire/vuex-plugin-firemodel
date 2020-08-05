import { List, Model, Record, pk } from "firemodel";

import { AbcApi } from "@/abc";
import { IDiscreteServerResults } from "@/types";

/**
 * Query's Firebase for a discrete set of records; allows
 * caller to specify whether local results should be excluded
 * from Firebase requests (or used to refresh results)
 */
export async function discreteServerRecords<T extends Model>(
  context: AbcApi<T>,
  /**
   * the primary keys which the user wants data for; this is either
   * an `id` or a _primary key reference_ but in both cases it is an
   * array of strings
   */
  pks: pk[],
  /** the primary keys discovered by local queries to Indexed DB */
  localPks: pk[] = [],
  /** determines whether results found locally should be retrieved from Firebase */
  refreshLocal: boolean = true
): Promise<IDiscreteServerResults<T>> {
  const missing = pks.filter(i => !localPks.includes(i));
  const requestForFirebase = refreshLocal ? pks : missing;
  const records = (
    await List.ids(context.model.constructor, ...requestForFirebase)
  ).data;
  console.log({ records });
  // const recordIds = records.map(i =>
  //   Record.compositeKeyRef(context.model.constructor, i)
  // );

  return {
    pks,
    allPks: localPks,
    missing: requestForFirebase,
    records,
    overallCachePerformance: context.cachePerformance,
    modelConfig: context.config
  };
}
