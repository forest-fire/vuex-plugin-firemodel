import type {
  IAbcAllQueryDefinition,
  IAbcFirebaseQueryResult,
  IAbcQueryHelper,
  IQueryOptions,
} from '@/types';

import { AbcApi } from '@/abc';
import { List } from 'firemodel';
import { QueryType } from '@/enums';

export const all: IAbcQueryHelper = function all<T>(
  defn: Omit<IAbcAllQueryDefinition<T>, 'queryType'> | IAbcAllQueryDefinition<T> = {}
) {
  return (ctx: AbcApi<T>, options: IQueryOptions<T> = {}) => {
    defn = { ...defn, queryType: QueryType.all };
    // The query to use for IndexedDB
    const dexieQuery = async () => {
      const recs = await ctx.dexieList.all();
      return recs;
    };

    // The query to use for Firebase
    const firemodelQuery = async (): Promise<IAbcFirebaseQueryResult<T>> => {
      const { data, query } = await List.all(ctx.model.constructor, options || {});
      return { data, query };
    };

    return { dexieQuery, firemodelQuery, queryDefn: defn };
  };
};

all.prototype.isQueryHelper = true;
