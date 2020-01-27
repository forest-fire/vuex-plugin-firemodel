import { Model } from "firemodel";
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
export declare function retrieveKeys<T extends Model>(command: AbcRequestCommand, ids: IAbcDiscreteRequest<T>, options: IAbcOptions<T>, context: AbcApi<T>): Promise<T[]>;
