"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../../types");
const firemodel_1 = require("firemodel");
const shared_1 = require("../shared");
/**
 * Offers a configuration to consumers of the standard _where_ clause that Firebase
 * provides and then provides an implementation that is aligned with the ABC `get`
 * and `load` endpoints.
 */
let where = function where(defn, options = {}) {
    defn = Object.assign(Object.assign({}, defn), { queryType: types_1.QueryType.where });
    return async (command, ctx) => {
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
        return shared_1.generalizedQuery(defn, command, dexieQuery, firemodelQuery, ctx, options);
    };
};
exports.where = where;
where.prototype.isQueryHelper = true;
//# sourceMappingURL=where.js.map