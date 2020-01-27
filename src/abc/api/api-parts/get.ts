import { Model } from "firemodel";
import { IAbcOptions, IAbcDiscreteRequest, AbcRequestCommand } from "../../../types";
import { AbcApi } from "../AbcApi";
import { getStore } from "../../../index";
import get from "lodash.get";

/**
 * Retrieves records from:
 * 
 * - **IndexedDB** (if configured to use)
 * - and then **Firebase** 
 *      → always with a `load` command
 *      → with a `get` command it will if the _getStrategy_ is "refreshAlways" or "refreshWhenMissing"
 * 
 * Results are always put into Vuex as soon as they are available.
 */
export async function retrieveKeys<T extends Model>(command: AbcRequestCommand, ids: IAbcDiscreteRequest<T>, options: IAbcOptions<T>, context: AbcApi<T>): Promise<T[]> {
  const records: T[] = []
  const store = getStore();
  const localState = get(store.state, `${context.about.modelMeta.localPrefix}`)

  if (!AbcApi.indexedDbConnected) {
    await AbcApi.connectIndexedDb()
  }

  if (context.config.useIndexedDb) {
    const waitFor: any[] = [];
    ids.forEach(id => waitFor.push(
      context.dexieRecord.get(id).then(rec => records.push(rec))
    ))
    await Promise.all(waitFor);

  }

  return []
}

