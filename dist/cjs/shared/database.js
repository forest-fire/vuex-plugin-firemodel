"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const abstracted_client_1 = require("abstracted-client");
const FiremodelPluginError_1 = require("../errors/FiremodelPluginError");
const firemodel_1 = require("firemodel");
let _db;
let _config;
/**
 * connects to a Firebase DB unless already connected in which case it
 * it just hands back the existing connection.
 */
async function database(config) {
    if (config) {
        if (JSON.stringify(config) !== JSON.stringify(_config) || !_db) {
            _db = await abstracted_client_1.DB.connect(config);
        }
        _config = config;
        firemodel_1.FireModel.defaultDb = _db;
    }
    if (!_db) {
        throw new FiremodelPluginError_1.FireModelPluginError("Trying to get the database connection but it has not been established yet!", "not-ready");
    }
    return _db;
}
exports.database = database;
//# sourceMappingURL=database.js.map