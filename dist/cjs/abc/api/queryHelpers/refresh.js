"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../../errors");
/**
 * **refresh**
 *
 * Gets **all** records from IndexedDB and then queries Firebase for records
 * since the passed in `timestamp`.
 *
 * If no timestamp is passed in than it will use a browser cookie that this plugin
 * maintains to indicate the last request to the DB.
 */
let refresh = function refresh(timestamp) {
    return (command, options, context) => {
        // if indexedDB, get all from IndexedDb and load into Vuex
        // if NOT then error (as the utility is not there)
        if (context.config.useIndexedDb) {
        }
        else {
            throw new errors_1.AbcError(`You have tried to ${command} the ${context.about.model.pascal} model with the "refresh" query helper but this has no real utility because this model has been configured to NOT use IndexedDB.`, `not-allowed`);
        }
        // save results to Vuex
        // request from Firebase
        return Promise.resolve([]);
    };
};
exports.refresh = refresh;
refresh.prototype.isQueryHelper = true;
//# sourceMappingURL=refresh.js.map