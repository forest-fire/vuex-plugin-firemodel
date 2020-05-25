"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.where = void 0;
const private_1 = require("../../../private");
const firemodel_1 = require("firemodel");
/**
 * Offers a configuration to consumers of the standard _where_ clause that Firebase
 * provides and then provides an implementation that is aligned with the ABC `get`
 * and `load` endpoints.
 */
exports.where = function where(defn) {
    defn = Object.assign(Object.assign({}, defn), { queryType: private_1.QueryType.where });
    return (ctx, options = {}) => {
        // The value and operation to be used
        const valueOp = defn.equals !== undefined
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
        const firemodelQuery = async () => {
            const list = await firemodel_1.List.where(ctx.model.constructor, defn.property, valueOp, options || {});
            return list.data;
        };
        return { dexieQuery, firemodelQuery, queryDefn: defn };
    };
};
exports.where.prototype.isQueryHelper = true;
/* export const where: IAbcQueryHelper = function where<T extends Model, K extends keyof T>(
  defn:
    | IAbcWhereQueryDefinition<T>
    | (IAbcWhereQueryDefinition<T> & { queryType: QueryType.where }),
) {
  defn = { ...defn, queryType: QueryType.where };
  return async (command, ctx: AbcApi<T>, options: IQueryOptions<T> = {}) => {
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
    const firemodelQuery = async () => {
      const list = await List.where(
        ctx.model.constructor,
        defn.property,
        valueOp,
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
};

where.prototype.isQueryHelper = true; */ 
//# sourceMappingURL=where.js.map