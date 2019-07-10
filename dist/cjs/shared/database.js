"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const abstracted_client_1 = require("abstracted-client");
const FiremodelPluginError_1 = require("../errors/FiremodelPluginError");
let _db;
/**
 * connects to a Firebase DB unless already connected in which case it
 * it just hands back the existing connection.
 */
async function database(config) {
    if (config) {
        _db = await abstracted_client_1.DB.connect(config);
    }
    if (!_db) {
        throw new FiremodelPluginError_1.FireModelPluginError("Trying to get the database connection but it has not been established yet!", "not-ready");
    }
    return _db;
}
exports.database = database;
//# sourceMappingURL=database.js.map