import { AbcApi } from "../AbcApi";
import { Model, List } from "firemodel";
import {
  AbcRequestCommand,
  IAbcSinceQueryDefinition,
  QueryType,
  IQueryOptions,
  SINCE_LAST_COOKIE
} from "../../../types";
import { AbcResult } from "../AbcResult";
import { generalizedQuery } from "../shared";
import cookies from "js-cookie";

/**
 * **since**
 *
 * Gets all records _since_ a certain timestamp (`epoch` with milliseconds)
 */
let since = function since<T extends Model, K extends keyof T>(
  defn:
    | IAbcSinceQueryDefinition<T>
    | (IAbcSinceQueryDefinition<T> & { queryType: QueryType.since }),
  options: IQueryOptions<T> = {}
) {
  return async (
    command: AbcRequestCommand,
    ctx: AbcApi<T>
  ): Promise<AbcResult<T>> => {
    defn = { ...defn, queryType: QueryType.since };
    if (!defn.timestamp) {
      const last = (cookies.getJSON(SINCE_LAST_COOKIE) || {})[ctx.model.pascal];
      if (!last) {
        cookies.set(
          SINCE_LAST_COOKIE,
          JSON.stringify({
            ...(cookies.getJSON(SINCE_LAST_COOKIE) || {}),
            [ctx.model.pascal]: new Date().getTime()
          })
        );
      }
      defn.timestamp = last || new Date().getTime();
    }
    // The query to use for IndexedDB
    const dexieQuery = async () => {
      const recs = await ctx.dexieList.since(defn.timestamp as number);

      return recs;
    };
    // The query to use for Firebase
    const firemodelQuery = async () => {
      const list = await List.since(
        ctx.model.constructor,
        defn.timestamp as number
      );
      return list.data;
    };

    return generalizedQuery(
      defn,
      command,
      dexieQuery,
      firemodelQuery,
      ctx,
      options
    );
  };
};

since.prototype.isQueryHelper = true;

export { since };
