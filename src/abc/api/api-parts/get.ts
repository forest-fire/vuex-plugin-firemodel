import { Model, IPrimaryKey } from "firemodel";
import { IAbcOptions, IAbcDiscreteRequest, AbcRequestCommand } from "../../../types";
import { AbcApi } from "../AbcApi";

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

  if (!AbcApi.indexedDbConnected) {
    await AbcApi.connectIndexedDb()
  }

  if (context.config.useIndexedDb) {
    const table = await AbcApi.dexieTable(context.about.model.pascal);

  }

}

