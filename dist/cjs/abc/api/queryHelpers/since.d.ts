import { AbcApi } from "../AbcApi";
import { IDictionary } from "common-types";
import { Model } from "firemodel";
/**
 * **since**
 *
 * Gets all records _since_ a certain timestamp (`epoch` with milliseconds)
 */
declare let since: <T extends Model = IDictionary<any>>(timestamp: number) => <T_1>(command: "load" | "get", context: AbcApi<T_1>) => Promise<T_1[]>;
export { since };
