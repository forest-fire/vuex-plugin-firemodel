"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.all = void 0;
const firemodel_1 = require("firemodel");
const private_1 = require("../../../private");
exports.all = function all(defn = {}) {
    return (ctx, options = {}) => {
        defn = Object.assign(Object.assign({}, defn), { queryType: private_1.QueryType.all });
        // The query to use for IndexedDB
        const dexieQuery = async () => {
            const recs = await ctx.dexieList.all();
            return recs;
        };
        // The query to use for Firebase
        const firemodelQuery = async () => {
            const { data, query } = await firemodel_1.List.all(ctx.model.constructor, options || {});
            return { data, query };
        };
        return { dexieQuery, firemodelQuery, queryDefn: defn };
    };
};
exports.all.prototype.isQueryHelper = true;
//# sourceMappingURL=all.js.map