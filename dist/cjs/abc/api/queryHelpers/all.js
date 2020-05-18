"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.all = void 0;
const types_1 = require("../../../types");
const firemodel_1 = require("firemodel");
exports.all = function all(defn = {}) {
    return (ctx, options = {}) => {
        defn = Object.assign(Object.assign({}, defn), { queryType: types_1.QueryType.all });
        // The query to use for IndexedDB
        const dexieQuery = async () => {
            const recs = await ctx.dexieList.all();
            return recs;
        };
        // The query to use for Firebase
        const firemodelQuery = async () => {
            const list = await firemodel_1.List.all(ctx.model.constructor, options || {});
            return list.data;
        };
        return { dexieQuery, firemodelQuery, queryDefn: defn };
    };
};
exports.all.prototype.isQueryHelper = true;
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
//# sourceMappingURL=all.js.map