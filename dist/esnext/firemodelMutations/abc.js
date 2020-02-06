import { changeRoot } from "../shared/changeRoot";
import { arrayToHash, hashToArray } from "typed-conversions";
import Vue from "vue";
import { AbcMutation } from "../types";
import get from "lodash.get";
export function abc(propOffset) {
    return {
        [AbcMutation.ABC_VUEX_UPDATE_FROM_IDX](state, payload) {
            if (payload.vuex.isList) {
                Vue.set(state, payload.vuex.fullPath, payload.records);
            }
            else {
                if (!validResultSize(payload, "local")) {
                    return;
                }
                changeRoot(state, payload.records[0], payload.vuex.moduleName);
            }
        },
        [AbcMutation.ABC_INDEXED_SKIPPED](state, payload) {
            // nothing to do; mutation is purely for informational/debugging purposes
        },
        [AbcMutation.ABC_FIREBASE_TO_VUEX_UPDATE](state, payload) {
            if (payload.vuex.isList) {
                const vuexRecords = state[payload.vuex.modulePostfix];
                const updated = hashToArray(Object.assign(Object.assign({}, arrayToHash(vuexRecords || [])), arrayToHash(payload.records || [])));
                Vue.set(state, payload.vuex.modulePostfix.replace(/\//g, "."), updated);
            }
            else {
                if (!validResultSize(payload, "server")) {
                    return;
                }
                changeRoot(state, payload.records[0], payload.vuex.moduleName);
            }
        },
        [AbcMutation.ABC_FIREBASE_REFRESH_INDEXED_DB](state, payload) {
            // nothing to do; mutation is purely for informational/debugging purposes
        },
        [AbcMutation.ABC_INDEXED_DB_REFRESH_FAILED](state, payload) {
            console.group("Indexed DB Problem");
            console.warn("Failure to refresh the IndexedDB!", payload.errorMessage);
            console.warn("Stack Trace: ", payload.errorStack);
            console.warn("Records attempted:", payload.missing);
            console.groupEnd();
        },
        [AbcMutation.ABC_NO_CACHE](state, payload) {
            // nothing to do; mutation is purely for informational/debugging purposes
        },
        [AbcMutation.ABC_LOCAL_QUERY_EMPTY](state, payload) {
            // nothing to do; mutation is purely for informational/debugging purposes
        },
        [AbcMutation.ABC_LOCAL_QUERY_TO_VUEX](state, payload) {
            if (payload.vuex.isList) {
                Vue.set(state, payload.vuex.modulePostfix, payload.records);
            }
            else {
                if (!validResultSize(payload)) {
                    return;
                }
                changeRoot(state, payload.records[0], payload.vuex.moduleName);
            }
        },
        [AbcMutation.ABC_PRUNE_STALE_IDX_RECORDS](state, payload) {
            // nothing to do; mutation is purely for informational/debugging purposes
        },
        [AbcMutation.ABC_PRUNE_STALE_VUEX_RECORDS](state, payload) {
            if (payload.vuex.isList) {
                const current = get(state, payload.vuex.modulePostfix, []);
                Vue.set(state, payload.vuex.modulePostfix, current.filter(i => !payload.pks.includes(i)));
            }
            else {
                changeRoot(state, null, payload.vuex.moduleName);
            }
        }
    };
}
function validResultSize(payload, where = "server") {
    const records = payload.records;
    if (records.length > 1) {
        console.warn(`There were ${records.length} records in the payload of the ${AbcMutation.ABC_VUEX_UPDATE_FROM_IDX} mutation for the ${payload.vuex.moduleName} Vuex module; this module is configured as for storage of a SINGULAR record not a list of records! This mutation will be ignored until this problem is corrected.`, records);
        return false;
    }
    if (records.length === 0) {
        console.warn(`There were zero records in the payload of the ${AbcMutation.ABC_VUEX_UPDATE_FROM_IDX} mutation for the ${payload.vuex.moduleName} Vuex module! This mutation will be ignored; use the ${AbcMutation.ABC_MODULE_CLEARED} mutation if your intent is to remove state from a Vuex module with the ABC API.`);
        return false;
    }
    return true;
}
