import { AbcApi } from "../AbcApi";
import { Model, List, FireModel, Record, pk } from "firemodel";
import { getStore } from "../../../index";
import { AbcRequestCommand, IDiscreteServerResults } from "../../../types";

export async function serverRecords<T extends Model>(
  apiCommand: AbcRequestCommand,
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

    apiCommand,
    overallCachePerformance: context.cachePerformance,

    modelConfig: context.config
  };
}
