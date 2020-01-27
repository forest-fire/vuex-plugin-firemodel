import { AbcApi } from "../AbcApi";
import { IDictionary } from "common-types";
import { Model } from "firemodel";
import { IAbcOptions } from "../../../types";
/**
 * **refresh**
 *
 * Gets **all** records from IndexedDB and then queries Firebase for records
 * since the passed in `timestamp`.
 *
 * If no timestamp is passed in than it will use a browser cookie that this plugin
 * maintains to indicate the last request to the DB.
 */
declare let refresh: <T extends Model = IDictionary<any>>(timestamp: number) => <T_1>(command: "load" | "get", options: IAbcOptions<T_1>, context: AbcApi<T_1>) => Promise<T_1[]>;
export { refresh };
