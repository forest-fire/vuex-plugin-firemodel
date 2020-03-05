"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firemodel_1 = require("firemodel");
const types_1 = require("../../../types");
const shared_1 = require("../shared");
const js_cookie_1 = __importDefault(require("js-cookie"));
/**
 * **since**
 *
 * Gets all records _since_ a certain timestamp (`epoch` with milliseconds)
 */
let since = function since(defn, options = {}) {
    return async (command, ctx) => {
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
        return shared_1.generalizedQuery(defn, command, dexieQuery, firemodelQuery, ctx, options);
    };
};
exports.since = since;
since.prototype.isQueryHelper = true;
//# sourceMappingURL=since.js.map