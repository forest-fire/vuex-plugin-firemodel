import { AbcApi } from "../AbcApi";
import { Model } from "firemodel";
import { AbcRequestCommand, IAbcSinceQueryDefinition, QueryType, IQueryOptions } from "../../../types";
import { AbcResult } from "../AbcResult";
/**
 * **since**
 *
 * Gets all records _since_ a certain timestamp (`epoch` with milliseconds)
 */
declare let since: <T extends Model, K extends keyof T>(defn: IAbcSinceQueryDefinition<T> | (IAbcSinceQueryDefinition<T> & {
    queryType: QueryType.since;
}), options?: IQueryOptions<T>) => (command: AbcRequestCommand, ctx: AbcApi<T>) => Promise<AbcResult<T>>;
export { since };
