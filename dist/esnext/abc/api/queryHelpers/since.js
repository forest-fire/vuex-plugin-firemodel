import { List } from "firemodel";
import { QueryType, SINCE_LAST_COOKIE } from "../../../types";
import cookies from "js-cookie";
/**
 * **since**
 *
 * Gets all records _since_ a certain timestamp (`epoch` with milliseconds)
 */
export const since = function since(defn) {
    return (ctx, options = {}) => {
        defn = Object.assign(Object.assign({}, defn), { queryType: QueryType.since });
        if (!defn.timestamp) {
            const last = (cookies.getJSON(SINCE_LAST_COOKIE) || {})[ctx.model.pascal];
            if (!last) {
                cookies.set(SINCE_LAST_COOKIE, JSON.stringify(Object.assign(Object.assign({}, (cookies.getJSON(SINCE_LAST_COOKIE) || {})), { [ctx.model.pascal]: new Date().getTime() })));
            }
            defn.timestamp = last || new Date().getTime();
        }
        // The query to use for IndexedDB
        const dexieQuery = async () => {
            const recs = await ctx.dexieList.since(defn.timestamp);
            return recs;
        };
        // The query to use for Firebase
        const firemodelQuery = async () => {
            const list = await List.since(ctx.model.constructor, defn.timestamp, options || {});
            return list.data;
        };
        return { dexieQuery, firemodelQuery, queryDefn: defn };
    };
};
/* export const since: IAbcQueryHelper = function since <T extends Model>(
  defn:
    | IAbcSinceQueryDefinition<T>
    | (IAbcSinceQueryDefinition<T> & { queryType: QueryType.since })
)  {
  return async (command, ctx: AbcApi<T>, options: IQueryOptions<T> = {}): Promise<AbcResult<T>> => {
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
        defn.timestamp as number,
        options || {}
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
}; */ 
