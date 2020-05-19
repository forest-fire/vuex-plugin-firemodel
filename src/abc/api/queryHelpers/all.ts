
import { AbcApi } from "../AbcApi";
import { List } from "firemodel";
import {  
  IAbcAllQueryDefinition,
  QueryType,IQueryOptions, 
  IAbcQueryHelper 
} from "../../../private";

export const all: IAbcQueryHelper = function all<T>(
  defn:
    | Omit<IAbcAllQueryDefinition<T>, "queryType">
    | IAbcAllQueryDefinition<T> = {}
) {
  return (ctx: AbcApi<T>, options: IQueryOptions<T> = {}) => {
    defn = { ...defn, queryType: QueryType.all };
    // The query to use for IndexedDB
    const dexieQuery = async () => {
      const recs = await ctx.dexieList.all();
      return recs;
    };

    // The query to use for Firebase
    const firemodelQuery = async () => {
      const list = await List.all(ctx.model.constructor, options || {});
      return list.data;
    };

    return { dexieQuery, firemodelQuery, queryDefn: defn };
  };
};

all.prototype.isQueryHelper = true;

/* export const allOld: IAbcQueryHelper = function all<T>(
  defn:
    | Omit<IAbcAllQueryDefinition<T>, "queryType">
    | IAbcAllQueryDefinition<T> = {}
) {
  return async (command, ctx: AbcApi<T>, options: IQueryOptions<T> = {}): Promise<AbcResult<T>> => {
    defn = { ...defn, queryType: QueryType.all };
    // The query to use for IndexedDB
    const dexieQuery = async () => {
      const recs = await ctx.dexieList.all();
      return recs;
    };

    // The query to use for Firebase
    const firemodelQuery = async () => {
      const list = await List.all(ctx.model.constructor, options || {});
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

allOld.prototype.isQueryHelper = true; */
