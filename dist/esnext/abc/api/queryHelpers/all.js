import { List } from "firemodel";
import { QueryType } from "../../../private";
export const all = function all(defn = {}) {
    return (ctx, options = {}) => {
        defn = Object.assign(Object.assign({}, defn), { queryType: QueryType.all });
        // The query to use for IndexedDB
        const dexieQuery = async () => {
            const recs = await ctx.dexieList.all();
            return recs;
        };
        // The query to use for Firebase
        const firemodelQuery = async () => {
            const { data, query } = await List.all(ctx.model.constructor, options || {});
            return { data, query };
        };
        return { dexieQuery, firemodelQuery, queryDefn: defn };
    };
};
all.prototype.isQueryHelper = true;
