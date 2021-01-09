import type {
  IAbcFirebaseQueryResult,
  IAbcQueryHelper,
  IAbcSinceQueryDefinition,
  IQueryOptions,
} from '@/types';
import { List, Model } from 'firemodel';
import { AbcApi } from '@/abc';
import cookies from 'js-cookie';
import { QueryType } from '@/enums';
import { SINCE_LAST_COOKIE } from '@/constants';

/**
 * **since**
 *
 * Gets all records _since_ a certain timestamp (`epoch` with milliseconds)
 */
export const since: IAbcQueryHelper = function since<T extends Model>(
  defn: IAbcSinceQueryDefinition<T> | (IAbcSinceQueryDefinition<T> & { queryType: QueryType.since })
) {
  return (ctx: AbcApi<T>, options: IQueryOptions<T> = {}) => {
    defn = { ...defn, queryType: QueryType.since };
    if (!defn.timestamp) {
      const last = (cookies.getJSON(SINCE_LAST_COOKIE) || {})[ctx.model.pascal];
      if (!last) {
        cookies.set(
          SINCE_LAST_COOKIE,
          JSON.stringify({
            ...(cookies.getJSON(SINCE_LAST_COOKIE) || {}),
            [ctx.model.pascal]: new Date().getTime(),
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
    const firemodelQuery = async (): Promise<IAbcFirebaseQueryResult<T>> => {
      const { data, query } = await List.since(
        ctx.model.constructor,
        defn.timestamp as number,
        options || {}
      );
      // SerializedQuery.create(list)
      return { data, query };
    };

    return { dexieQuery, firemodelQuery, queryDefn: defn };
  };
};
