import {
  IAbcFirebaseQueryResult,
  IAbcQueryHelper,
  IAbcWhereQueryDefinition,
  IQueryOptions,
  QueryType
} from "@/types";
import { IComparisonOperator, List, Model, PropType } from "firemodel";

import { AbcApi } from "@/abc";

/**
 * Offers a configuration to consumers of the standard _where_ clause that Firebase
 * provides and then provides an implementation that is aligned with the ABC `get`
 * and `load` endpoints.
 */
export const where: IAbcQueryHelper = function where<
  T extends Model,
  K extends keyof T
>(
  defn:
    | IAbcWhereQueryDefinition<T>
    | (IAbcWhereQueryDefinition<T> & { queryType: QueryType.where })
) {
  defn = { ...defn, queryType: QueryType.where };
  return (ctx: AbcApi<T>, options: IQueryOptions<T> = {}) => {
    // The value and operation to be used
    const valueOp: PropType<T, K> | [IComparisonOperator, PropType<T, K>] =
      defn.equals !== undefined
        ? defn.equals
        : defn.greaterThan !== undefined
        ? [">", defn.greaterThan]
        : ["<", defn.lessThan];
    // The query to use for IndexedDB
    const dexieQuery = async () => {
      const recs = await ctx.dexieList.where(defn.property, valueOp);
      return recs;
    };

    // The query to use for Firebase
    const firemodelQuery = async (): Promise<IAbcFirebaseQueryResult<T>> => {
      const { data, query } = await List.where(
        ctx.model.constructor,
        defn.property,
        valueOp,
        options || {}
      );
      return { data, query };
    };

    return { dexieQuery, firemodelQuery, queryDefn: defn };
  };
};

where.prototype.isQueryHelper = true;
