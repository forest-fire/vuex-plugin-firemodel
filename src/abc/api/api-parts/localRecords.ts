import { Model, Record, IPrimaryKey } from "firemodel";
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
  requestPks: IPrimaryKey<T>[],
  options: IAbcOptions<T>,
  context: AbcApi<T>
): Promise<Omit<IDiscreteLocalResults<T>, "overallCachePerformance">> {
  const idxRecords: T[] = [];
  const store = getStore();

  const vuexRecords: T[] = get(
    store.state,
    context.about.vuex.fullPath.replace(/\//g, "."),
    []
  );

  if (!AbcApi.indexedDbConnected) {
    await AbcApi.connectIndexedDb();
  }

  if (context.config.useIndexedDb) {
    const waitFor: any[] = [];
    requestPks.forEach(id =>
      waitFor.push(
        context.dexieRecord.get(id).then(rec => {
          if (rec) idxRecords.push(rec);
        })
      )
    );
    await Promise.all(waitFor);
  }
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

  const modulePostfix = context.about.modelMeta.localPostfix as string;
  const moduleIsList = context.about.config.isList as boolean;
  const vuexModuleName = (context.config.moduleName || moduleIsList
    ? context.about.model.plural
    : context.about.modelMeta.localModelName) as string;

  return {
    cacheHits: localIds.length,
    cacheMisses: missingIds.length,
    foundInIndexedDb: idxPks,
    foundInVuex: vuexPks,
    foundExclusivelyInIndexedDb: idxPks.filter(i => !vuexPks.includes(i)),
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
