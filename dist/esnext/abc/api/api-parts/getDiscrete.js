import { serverRecords } from "../shared";
import { AbcResult } from "..";
import { getStore, AbcMutation, AbcStrategy } from "../../..";
import { localRecords } from "./localRecords";
import { AbcError } from "../../../errors";
import { capitalize } from "../../../shared";
export async function requestIndexedDb(command, ctx, options = {}, requestIds) {
    const t0 = performance.now();
    const store = getStore();
    let results = command === "load" ? undefined : await localRecords(command, requestIds, options, ctx);
    let local = undefined;
    if (results) {
        this._cacheHits += results.cacheHits;
        this._cacheMisses += results.cacheMisses;
        local = Object.assign(Object.assign({}, results), { overallCachePerformance: this.cachePerformance });
    }
    if (!this.config.useIndexedDb && command === "load") {
        throw new AbcError(`There was a call to load${capitalize(this.model.plural)}() but this is not allowed for models like ${this.model.pascal} which have been configured in ABC to not have IndexedDB support; use get${capitalize(this.model.plural)}() instead.`, "not-allowed");
    }
    const t1 = performance.now();
    const perfLocal = t1 - t0;
    const localResult = new AbcResult(this, {
        type: "discrete",
        local,
        options
    }, { perfLocal });
    if ((local === null || local === void 0 ? void 0 : local.cacheHits) === 0) {
        // No results locally
        store.commit(`${this.vuex.moduleName}/${AbcMutation.ABC_NO_CACHE}`, localResult);
    }
    else if (this.config.useIndexedDb) {
        // Using IndexedDB
        if (local === null || local === void 0 ? void 0 : local.foundExclusivelyInIndexedDb) {
            store.commit(`${this.vuex.moduleName}/${AbcMutation.ABC_VUEX_UPDATE_FROM_IDX}`, localResult);
        }
        else {
            store.commit(`${this.vuex.moduleName}/${AbcMutation.ABC_INDEXED_SKIPPED}`, localResult);
        }
    }
    // TODO: Add GetFirebase strategy to conditional once implemented
    if (local === null || local === void 0 ? void 0 : local.allFoundLocally) {
        return { local, localResult };
    }
    return { local };
}
export async function requestServer(command, ctx, local, options = {}, requestIds) {
    const store = getStore();
    const server = await serverRecords(ctx, requestIds, requestIds);
    const serverResults = new AbcResult(this, {
        type: "discrete",
        local,
        server,
        options
    }, {});
    // Update Vuex with server results
    if (command === "get") {
        store.commit(`${this.vuex.moduleName}/${AbcMutation.ABC_FIREBASE_TO_VUEX_UPDATE}`, serverResults);
    }
    // load data into Vuex
    if (command === "load" && options.strategy === AbcStrategy.loadVuex) {
        store.commit(`${this.vuex.moduleName}/${AbcMutation.ABC_FIREBASE_TO_VUEX_UPDATE}`, serverResults);
    }
    return { server, serverResults };
}
export async function cacheIndexedDB(server, serverResults) {
    const store = getStore();
    try {
        const waitFor = [];
        const now = new Date().getTime();
        server.records.forEach(record => {
            const newRec = Object.assign(Object.assign({}, record), { lastUpdated: now, createdAt: record.createdAt || now });
            waitFor.push(this.dexieTable.put(newRec));
        });
        await Promise.all(waitFor);
        store.commit(`${this.vuex.moduleName}/${AbcMutation.ABC_FIREBASE_REFRESH_INDEXED_DB}`, serverResults);
    }
    catch (e) {
        store.commit(`${this.vuex.moduleName}/${AbcMutation.ABC_INDEXED_DB_REFRESH_FAILED}`, Object.assign(Object.assign({}, serverResults), { errorMessage: e.message, errorStack: e.stack }));
    }
}
