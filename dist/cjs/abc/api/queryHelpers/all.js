"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../../types");
const firemodel_1 = require("firemodel");
const shared_1 = require("../shared");
let all = function all(defn = {}, options = {}) {
    return async (command, ctx) => {
        defn = Object.assign(Object.assign({}, defn), { queryType: types_1.QueryType.all });
        // The query to use for IndexedDB
        const dexieQuery = async () => {
            const recs = await ctx.dexieList.all();
            return recs;
        };
        // The query to use for Firebase
        const firemodelQuery = async () => {
            const list = await firemodel_1.List.all(ctx.model.constructor);
            return list.data;
        };
        return shared_1.generalizedQuery(defn, command, dexieQuery, firemodelQuery, ctx, options);
    };
};
exports.all = all;
all.prototype.isQueryHelper = true;
//# sourceMappingURL=all.js.map