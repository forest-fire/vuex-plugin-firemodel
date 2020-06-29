"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.since = void 0;
const private_1 = require("../../../private");
const firemodel_1 = require("firemodel");
const js_cookie_1 = __importDefault(require("js-cookie"));
/**
 * **since**
 *
 * Gets all records _since_ a certain timestamp (`epoch` with milliseconds)
 */
exports.since = function since(defn) {
    return (ctx, options = {}) => {
        defn = Object.assign(Object.assign({}, defn), { queryType: private_1.QueryType.since });
        if (!defn.timestamp) {
            const last = (js_cookie_1.default.getJSON(private_1.SINCE_LAST_COOKIE) || {})[ctx.model.pascal];
            if (!last) {
                js_cookie_1.default.set(private_1.SINCE_LAST_COOKIE, JSON.stringify(Object.assign(Object.assign({}, (js_cookie_1.default.getJSON(private_1.SINCE_LAST_COOKIE) || {})), { [ctx.model.pascal]: new Date().getTime() })));
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
            const { data, query } = await firemodel_1.List.since(ctx.model.constructor, defn.timestamp, options || {});
            // SerializedQuery.create(list)
            return { data, query };
        };
        return { dexieQuery, firemodelQuery, queryDefn: defn };
    };
};
//# sourceMappingURL=since.js.map