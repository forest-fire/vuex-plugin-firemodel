import { AbcRequestCommand, QueryType } from "../../../types";
import { AbcApi } from "../AbcApi";
import { AbcResult, IQueryOptions } from "../../..";
import { Model } from "firemodel";
/**
 * Offers a configuration to consumers of the standard _where_ clause that Firebase
 * provides and then provides an implementation that is aligned with the ABC `get`
 * and `load` endpoints.
 */
declare let where: <T extends Model, K extends keyof T>(defn: import("../../..").IAbcWhereQueryEquals<T> | import("../../..").IAbcWhereQueryGreaterThan<T> | import("../../..").IAbcWhereQueryLessThan<T> | (import("../../..").IAbcWhereQueryEquals<T> & {
    queryType: QueryType.where;
}) | (import("../../..").IAbcWhereQueryGreaterThan<T> & {
    queryType: QueryType.where;
}) | (import("../../..").IAbcWhereQueryLessThan<T> & {
    queryType: QueryType.where;
}), options?: IQueryOptions<T>) => (command: AbcRequestCommand, ctx: AbcApi<T>) => Promise<AbcResult<T>>;
export { where };
