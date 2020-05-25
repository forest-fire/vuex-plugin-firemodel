import { FireModelPluginError } from "../private";
let _db;
/**
 * provides access to the database that was passed in by the consuming application
 */
export function getDatabase() {
    if (!_db) {
        throw new FireModelPluginError(`A call to database() failed because the database was not set!`);
    }
    return _db;
}
export function storeDatabase(db) {
    _db = db;
}
