import {
  IAbcFirebaseQueryResult,
  IAbcQueryHelper,
  IAbcSinceQueryDefinition,
  IQueryOptions,
  QueryType,
  SINCE_LAST_COOKIE
} from "@/types";
import { List, Model } from "firemodel";

import { AbcApi } from "@/abc";
import { getCookie, setCookie } from "@/util";

/**
 * **since**
 *
 * Gets all records _since_ a certain timestamp (`epoch` with milliseconds)
 */
export const since: IAbcQueryHelper = function since<T extends Model>(
  defn:
    | IAbcSinceQueryDefinition<T>
    | (IAbcSinceQueryDefinition<T> & { queryType: QueryType.since })
) {
  return (ctx: AbcApi<T>, options: IQueryOptions<T> = {}) => {
    defn = { ...defn, queryType: QueryType.since };
    if (!defn.timestamp) {
      const last = getCookie(ctx.model.pascal);
      if (!last) {
        setCookie(ctx.model.pascal);
      }
      defn.timestamp = last || new Date("1970-01-01T00:00:00").getTime();
    }

    // The query to use for IndexedDB
    const dexieQuery = async () => {
      const recs = await ctx.dexieList.since(defn.timestamp as number);
      return recs;
    };

    // The query to use for Firebase
    const firemodelQuery = async (): Promise<IAbcFirebaseQueryResult<T>> => {
      const { data, query } = await List.since(
        ctx.model.constructor,
        defn.timestamp as number,
        options || {}
      );
      return { data, query };
    };

    return { dexieQuery, firemodelQuery, queryDefn: defn };
  };
};
