"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeDatabase = exports.database = void 0;
const private_1 = require("../private");
let _db;
/**
 * provides access to the database that was passed in by the consuming application
 */
function database() {
    if (!_db) {
        throw new private_1.FireModelPluginError(`A call to database() failed because the database was not set!`);
    }
    return _db;
}
exports.database = database;
function storeDatabase(db) {
    _db = db;
}
exports.storeDatabase = storeDatabase;
//# sourceMappingURL=database.js.map