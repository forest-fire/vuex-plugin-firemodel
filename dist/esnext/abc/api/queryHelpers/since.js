import { List } from "firemodel";
import { QueryType, SINCE_LAST_COOKIE } from "../../../types";
import { generalizedQuery } from "../shared";
import cookies from "js-cookie";
/**
 * **since**
 *
 * Gets all records _since_ a certain timestamp (`epoch` with milliseconds)
 */
let since = function since(defn, options = {}) {
    return async (command, ctx) => {
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
        return generalizedQuery(defn, command, dexieQuery, firemodelQuery, ctx, options);
    };
};
since.prototype.isQueryHelper = true;
export { since };
