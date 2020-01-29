import { Model, Record } from "firemodel";
import {
  IAbcOptions,
  IAbcDiscreteRequest,
  AbcRequestCommand,
  IDiscreteLocalResults
} from "../../../types";
import { AbcApi } from "../AbcApi";
import { getStore } from "../../../index";
import get from "lodash.get";

/**
 * For a discrete set of primary keys, get's all knowledge of these locally. This means
 * at least Vuex but also IndexedDB if the model is configured for it.
 *
 * It returns both
 * a complete list of the primary keys found, those still missing, as well as the records
 * themselves (where Vuex representation of a record trumps the IndexedDB representation)
 */
export async function localRecords<T extends Model>(
  command: AbcRequestCommand,
  ids: IAbcDiscreteRequest<T>,
  options: IAbcOptions<T>,
  context: AbcApi<T>
): Promise<IDiscreteLocalResults<T>> {
  const idxRecords: T[] = [];
  const vuexRecords: T[] = [];
  const store = getStore();

  const localState = get(store.state, `${context.about.modelMeta.localPrefix}`);

  if (!AbcApi.indexedDbConnected) {
    await AbcApi.connectIndexedDb();
  }

  if (context.config.useIndexedDb) {
    const waitFor: any[] = [];
    ids.forEach(id =>
      waitFor.push(
        context.dexieRecord.get(id).then(rec => {
          if (rec) idxRecords.push(rec);
        })
      )
    );
    await Promise.all(waitFor);
  }

  const model = context.modelConstructor;
  const vuexIds = vuexRecords.map(v => Record.create(model, v).compositeKeyRef);
  const idxIds = idxRecords.map(i => Record.create(model, i).compositeKeyRef);

  const localIds = Array.from(
    new Set<string>([...vuexIds, ...idxIds])
  );
  const missingIds = ids
    .map(pk =>
      typeof pk === "string" ? pk : Record.create(model, pk).compositeKeyRef
    )
    .filter(pk => !localIds.includes(pk));

  const modulePostfix = context.about.modelMeta.localPostfix as string;
  const vuexModuleName = (context.config.moduleName ||
    context.about.modelMeta.localModelName) as string;
  const moduleIsList = context.about.config.isList as boolean;

  return {
    cacheHits: localIds.length,
    cacheMisses: missingIds.length,
    overallCachePerformance: context.cachePerformance,
    foundInIndexedDb: idxIds,
    foundInVuex: vuexIds,
    foundExclusivelyInIndexedDb: idxIds.filter(i => !vuexIds.includes(i)),
    allFoundLocally: missingIds.length === 0 ? true : false,
    records: [...idxRecords, ...vuexRecords],
    missing: missingIds,
    apiCommand: command,
    modelConfig: context.config,
    moduleIsList,
    modulePostfix,
    vuexModuleName
  };
}
