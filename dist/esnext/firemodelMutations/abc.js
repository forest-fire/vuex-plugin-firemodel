import { AbcError, AbcMutation, DbSyncOperation, } from "../private";
import { arrayToHash, hashToArray } from "typed-conversions";
import Vue from "vue";
import { changeRoot } from '../shared';
import { get } from "../shared/index";
export function AbcFiremodelMutation(propOffset) {
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
        [DbSyncOperation.ABC_FIREBASE_SET_VUEX](state, payload) {
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
        [DbSyncOperation.ABC_FIREBASE_SET_DYNAMIC_PATH_VUEX](state, payload) {
            // TODO: add code for dynamic path strategy here
        },
        [DbSyncOperation.ABC_FIREBASE_MERGE_VUEX](state, payload) {
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
        [DbSyncOperation.ABC_FIREBASE_SET_INDEXED_DB](state, payload) {
            // nothing to do; mutation is purely for informational/debugging purposes
        },
        [DbSyncOperation.ABC_FIREBASE_MERGE_INDEXED_DB](state, payload) {
            // nothing to do; mutation is purely for informational/debugging purposes
        },
        [DbSyncOperation.ABC_FIREBASE_SET_DYNAMIC_PATH_INDEXED_DB](state, payload) {
            // nothing to do; mutation is purely for informational/debugging purposes
        },
        [DbSyncOperation.ABC_INDEXED_DB_SET_VUEX](state, payload) {
            if (payload.vuex.isList) {
                if (!payload.resultFromQuery) {
                    throw new AbcError(`Attempt to use mutation ${DbSyncOperation.ABC_INDEXED_DB_SET_VUEX} with a discrete request.`, 'not-allowed');
                }
                Vue.set(state, payload.vuex.modulePostfix.replace(/\//g, "."), payload.records);
            }
            else {
                if (process.env.NODE_ENV !== 'production') {
                    console.info(`You are using a query on a singular model ${payload.vuex.moduleName}; this typically should be avoided.`);
                }
                changeRoot(state, payload.records[0], payload.vuex.moduleName);
            }
        },
        [DbSyncOperation.ABC_INDEXED_DB_SET_DYNAMIC_PATH_VUEX](state, payload) {
            console.log(payload.options.offsets);
            // getProduct(all(), { offsets: { store: '1234' } })
            if (payload.vuex.isList) {
                /* if (!payload.resultFromQuery) {
                  throw new AbcError(`Attempt to use mutation ${DbSyncOperation.ABC_INDEXED_DB_SET_VUEX} with a discrete request.`, 'not-allowed');
                } */
                // Vue.set(state, payload.vuex.modulePostfix.replace(/\//g, "."), payload.records);
                // get dynamic path from payload
            }
            else {
                if (process.env.NODE_ENV !== 'production') {
                    console.info(`You are using a query on a singular model ${payload.vuex.moduleName}; this typically should be avoided.`);
                }
                changeRoot(state, payload.records[0], payload.vuex.moduleName);
            }
        },
        [DbSyncOperation.ABC_INDEXED_DB_MERGE_VUEX](state, payload) {
            console.log(payload.options.offsets);
            if (payload.vuex.isList) {
                console.log(`Is a list`);
                // const vuexRecords = state[payload.vuex.modulePostfix];
                // const updated = hashToArray({
                //   ...arrayToHash(vuexRecords || []),
                //   ...arrayToHash(payload.records || [])
                // });
                // Vue.set(state, payload.vuex.modulePostfix.replace(/\//g, "."), updated);
            }
            else {
                console.log(`Is not a list`);
                // if (!validResultSize(payload, "server")) {
                //   return;
                // }
                // changeRoot<T>(state, payload.records[0], payload.vuex.moduleName);
            }
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
        [DbSyncOperation.ABC_INDEXED_DB_SET_VUEX](state, payload) {
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
                Vue.set(state, payload.vuex.modulePostfix, current.filter(i => !payload.pks.includes(i.id)));
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
