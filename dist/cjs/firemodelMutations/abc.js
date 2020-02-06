"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const changeRoot_1 = require("../shared/changeRoot");
const typed_conversions_1 = require("typed-conversions");
const vue_1 = __importDefault(require("vue"));
const types_1 = require("../types");
const lodash_get_1 = __importDefault(require("lodash.get"));
function abc(propOffset) {
    return {
        [types_1.AbcMutation.ABC_VUEX_UPDATE_FROM_IDX](state, payload) {
            if (payload.vuex.isList) {
                vue_1.default.set(state, payload.vuex.fullPath, payload.records);
            }
            else {
                if (!validResultSize(payload, "local")) {
                    return;
                }
                changeRoot_1.changeRoot(state, payload.records[0], payload.vuex.moduleName);
            }
        },
        [types_1.AbcMutation.ABC_INDEXED_SKIPPED](state, payload) {
            // nothing to do; mutation is purely for informational/debugging purposes
        },
        [types_1.AbcMutation.ABC_FIREBASE_TO_VUEX_UPDATE](state, payload) {
            if (payload.vuex.isList) {
                const vuexRecords = state[payload.vuex.modulePostfix];
                const updated = typed_conversions_1.hashToArray(Object.assign(Object.assign({}, typed_conversions_1.arrayToHash(vuexRecords || [])), typed_conversions_1.arrayToHash(payload.records || [])));
                vue_1.default.set(state, payload.vuex.modulePostfix.replace(/\//g, "."), updated);
            }
            else {
                if (!validResultSize(payload, "server")) {
                    return;
                }
                changeRoot_1.changeRoot(state, payload.records[0], payload.vuex.moduleName);
            }
        },
        [types_1.AbcMutation.ABC_FIREBASE_REFRESH_INDEXED_DB](state, payload) {
            // nothing to do; mutation is purely for informational/debugging purposes
        },
        [types_1.AbcMutation.ABC_INDEXED_DB_REFRESH_FAILED](state, payload) {
            console.group("Indexed DB Problem");
            console.warn("Failure to refresh the IndexedDB!", payload.errorMessage);
            console.warn("Stack Trace: ", payload.errorStack);
            console.warn("Records attempted:", payload.missing);
            console.groupEnd();
        },
        [types_1.AbcMutation.ABC_NO_CACHE](state, payload) {
            // nothing to do; mutation is purely for informational/debugging purposes
        },
        [types_1.AbcMutation.ABC_LOCAL_QUERY_EMPTY](state, payload) {
            // nothing to do; mutation is purely for informational/debugging purposes
        },
        [types_1.AbcMutation.ABC_LOCAL_QUERY_TO_VUEX](state, payload) {
            if (payload.vuex.isList) {
                vue_1.default.set(state, payload.vuex.modulePostfix, payload.records);
            }
            else {
                if (!validResultSize(payload)) {
                    return;
                }
                changeRoot_1.changeRoot(state, payload.records[0], payload.vuex.moduleName);
            }
        },
        [types_1.AbcMutation.ABC_PRUNE_STALE_IDX_RECORDS](state, payload) {
            // nothing to do; mutation is purely for informational/debugging purposes
        },
        [types_1.AbcMutation.ABC_PRUNE_STALE_VUEX_RECORDS](state, payload) {
            if (payload.vuex.isList) {
                const current = lodash_get_1.default(state, payload.vuex.modulePostfix, []);
                vue_1.default.set(state, payload.vuex.modulePostfix, current.filter(i => !payload.pks.includes(i)));
            }
            else {
                changeRoot_1.changeRoot(state, null, payload.vuex.moduleName);
            }
        }
    };
}
exports.abc = abc;
function validResultSize(payload, where = "server") {
    const records = payload.records;
    if (records.length > 1) {
        console.warn(`There were ${records.length} records in the payload of the ${types_1.AbcMutation.ABC_VUEX_UPDATE_FROM_IDX} mutation for the ${payload.vuex.moduleName} Vuex module; this module is configured as for storage of a SINGULAR record not a list of records! This mutation will be ignored until this problem is corrected.`, records);
        return false;
    }
    if (records.length === 0) {
        console.warn(`There were zero records in the payload of the ${types_1.AbcMutation.ABC_VUEX_UPDATE_FROM_IDX} mutation for the ${payload.vuex.moduleName} Vuex module! This mutation will be ignored; use the ${types_1.AbcMutation.ABC_MODULE_CLEARED} mutation if your intent is to remove state from a Vuex module with the ABC API.`);
        return false;
    }
    return true;
}
//# sourceMappingURL=abc.js.map