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
  const records = (await List.ids(context.modelConstructor, ...pks)).data;
  const recordIds = records.map(
    i => Record.create(context.modelConstructor, i).compositeKeyRef
  );
  const missing = pks.filter(i => !recordIds.includes(i));

  const modulePostfix = context.about.modelMeta.localPostfix as string;
  const vuexModuleName = (context.config.moduleName ||
    context.about.modelMeta.localModelName) as string;
  const moduleIsList = context.about.config.isList as boolean;

  return {
    pks,
    allPks,
    missing,
    records,

    apiCommand,
    overallCachePerformance: context.cachePerformance,

    vuexModuleName,
    moduleIsList,
    modulePostfix,

    modelConfig: context.config
  };
}
