"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = void 0;
const universal_fire_1 = require("universal-fire");
const firemodel_1 = require("firemodel");
const private_1 = require("../private");
let _db;
/**
 * connects to a Firebase DB unless already connected in which case it
 * it just hands back the existing connection.
 */
async function database(config) {
    if (!_db) {
        _db = await universal_fire_1.DB.connect(universal_fire_1.RealTimeClient, config);
        firemodel_1.FireModel.defaultDb = _db;
    }
    if (!_db) {
        throw new private_1.FireModelPluginError("Trying to get the database connection but it has not been established yet!", "not-ready");
    }
    return _db;
}
exports.database = database;
//# sourceMappingURL=database.js.map