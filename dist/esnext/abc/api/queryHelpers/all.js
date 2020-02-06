import { QueryType } from "../../../types";
import { List } from "firemodel";
import { generalizedQuery } from "../shared";
let all = function all(defn = {}, options = {}) {
    return async (command, ctx) => {
        defn = Object.assign(Object.assign({}, defn), { queryType: QueryType.all });
        // The query to use for IndexedDB
        const dexieQuery = async () => {
            const recs = await ctx.dexieList.all();
            return recs;
        };
        // The query to use for Firebase
        const firemodelQuery = async () => {
            const list = await List.all(ctx.model.constructor);
            return list.data;
        };
        return generalizedQuery(defn, command, dexieQuery, firemodelQuery, ctx, options);
    };
};
all.prototype.isQueryHelper = true;
export { all };
