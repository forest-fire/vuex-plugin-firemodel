"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.since = void 0;
const firemodel_1 = require("firemodel");
const types_1 = require("../../../types");
const js_cookie_1 = __importDefault(require("js-cookie"));
/**
 * **since**
 *
 * Gets all records _since_ a certain timestamp (`epoch` with milliseconds)
 */
exports.since = function since(defn) {
    return (ctx, options = {}) => {
        defn = Object.assign(Object.assign({}, defn), { queryType: types_1.QueryType.since });
        if (!defn.timestamp) {
            const last = (js_cookie_1.default.getJSON(types_1.SINCE_LAST_COOKIE) || {})[ctx.model.pascal];
            if (!last) {
                js_cookie_1.default.set(types_1.SINCE_LAST_COOKIE, JSON.stringify(Object.assign(Object.assign({}, (js_cookie_1.default.getJSON(types_1.SINCE_LAST_COOKIE) || {})), { [ctx.model.pascal]: new Date().getTime() })));
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
            const list = await firemodel_1.List.since(ctx.model.constructor, defn.timestamp, options || {});
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
//# sourceMappingURL=since.js.map