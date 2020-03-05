import {
  IAbcAllQueryDefinition,
  AbcRequestCommand,
  QueryType
} from "../../../types";
import { AbcApi } from "../AbcApi";
import { AbcResult, IQueryOptions } from "../../..";
import { List } from "firemodel";
import { generalizedQuery } from "../shared";

let all = function all<T>(
  defn:
    | Omit<IAbcAllQueryDefinition<T>, "queryType">
    | IAbcAllQueryDefinition<T> = {},
  options: IQueryOptions<T> = {}
) {
  return async (
    command: AbcRequestCommand,
    ctx: AbcApi<T>
  ): Promise<AbcResult<T>> => {
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

all.prototype.isQueryHelper = true;

export { all };
