"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbcApi_1 = require("../AbcApi");
const index_1 = require("../../../index");
const lodash_get_1 = __importDefault(require("lodash.get"));
/**
 * Retrieves records from:
 *
 * - **IndexedDB** (if configured to use)
 * - and then **Firebase**
 *      → always with a `load` command
 *      → with a `get` command it will if the _getStrategy_ is "refreshAlways" or "refreshWhenMissing"
 *
 * Results are always put into Vuex as soon as they are available.
 */
async function retrieveKeys(command, ids, options, context) {
    const records = [];
    const store = index_1.getStore();
    const localState = lodash_get_1.default(store.state, `${context.about.modelMeta.localPrefix}`);
    if (!AbcApi_1.AbcApi.indexedDbConnected) {
        await AbcApi_1.AbcApi.connectIndexedDb();
    }
    if (context.config.useIndexedDb) {
        const waitFor = [];
        ids.forEach(id => waitFor.push(context.dexieRecord.get(id).then(rec => records.push(rec))));
        await Promise.all(waitFor);
    }
    return [];
}
exports.retrieveKeys = retrieveKeys;
//# sourceMappingURL=get.js.map