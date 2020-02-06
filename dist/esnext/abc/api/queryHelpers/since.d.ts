import { AbcApi } from "../AbcApi";
import { IDictionary } from "common-types";
import { Model } from "firemodel";
import { AbcRequestCommand, IAbcSinceQueryDefinition, IAbcAllQueryDefinition } from "../../../types";
/**
 * **since**
 *
 * Gets all records _since_ a certain timestamp (`epoch` with milliseconds)
 */
declare let since: <T extends Model = IDictionary<any>>(defn: Pick<IAbcSinceQueryDefinition<T>, "limit" | "offset" | "timestamp">) => <T_1>(defn?: Pick<IAbcAllQueryDefinition<T_1>, "limit" | "offset"> | undefined) => (command: AbcRequestCommand, ctx: AbcApi<T_1>) => Promise<void>;
export { since };
