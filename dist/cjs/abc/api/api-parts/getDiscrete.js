"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_1 = require("../shared");
const __1 = require("..");
const __2 = require("../../..");
const localRecords_1 = require("./localRecords");
const errors_1 = require("../../../errors");
const shared_2 = require("../../../shared");
async function requestIndexedDb(command, ctx, options = {}, requestIds) {
    const t0 = performance.now();
    const store = __2.getStore();
    let results = command === "load" ? undefined : await localRecords_1.localRecords(command, requestIds, options, ctx);
    let local = undefined;
    if (results) {
        this._cacheHits += results.cacheHits;
        this._cacheMisses += results.cacheMisses;
        local = Object.assign(Object.assign({}, results), { overallCachePerformance: this.cachePerformance });
    }
    if (!this.config.useIndexedDb && command === "load") {
        throw new errors_1.AbcError(`There was a call to load${shared_2.capitalize(this.model.plural)}() but this is not allowed for models like ${this.model.pascal} which have been configured in ABC to not have IndexedDB support; use get${shared_2.capitalize(this.model.plural)}() instead.`, "not-allowed");
    }
    const t1 = performance.now();
    const perfLocal = t1 - t0;
    const localResult = new __1.AbcResult(this, {
        type: "discrete",
        local,
        options
    }, { perfLocal });
    if ((local === null || local === void 0 ? void 0 : local.cacheHits) === 0) {
        // No results locally
        store.commit(`${this.vuex.moduleName}/${__2.AbcMutation.ABC_NO_CACHE}`, localResult);
    }
    else if (this.config.useIndexedDb) {
        // Using IndexedDB
        if (local === null || local === void 0 ? void 0 : local.foundExclusivelyInIndexedDb) {
            store.commit(`${this.vuex.moduleName}/${__2.AbcMutation.ABC_VUEX_UPDATE_FROM_IDX}`, localResult);
        }
        else {
            store.commit(`${this.vuex.moduleName}/${__2.AbcMutation.ABC_INDEXED_SKIPPED}`, localResult);
        }
    }
    // TODO: Add GetFirebase strategy to conditional once implemented
    if (local === null || local === void 0 ? void 0 : local.allFoundLocally) {
        return { local, localResult };
    }
    return { local };
}
exports.requestIndexedDb = requestIndexedDb;
async function requestServer(command, ctx, local, options = {}, requestIds) {
    const store = __2.getStore();
    const server = await shared_1.serverRecords(ctx, requestIds, requestIds);
    const serverResults = new __1.AbcResult(this, {
        type: "discrete",
        local,
        server,
        options
    }, {});
    // Update Vuex with server results
    if (command === "get") {
        store.commit(`${this.vuex.moduleName}/${__2.AbcMutation.ABC_FIREBASE_TO_VUEX_UPDATE}`, serverResults);
    }
    // load data into Vuex
    if (command === "load" && options.strategy === __2.AbcStrategy.loadVuex) {
        store.commit(`${this.vuex.moduleName}/${__2.AbcMutation.ABC_FIREBASE_TO_VUEX_UPDATE}`, serverResults);
    }
    return { server, serverResults };
}
exports.requestServer = requestServer;
async function cacheIndexedDB(server, serverResults) {
    const store = __2.getStore();
    try {
        const waitFor = [];
        const now = new Date().getTime();
        server.records.forEach(record => {
            const newRec = Object.assign(Object.assign({}, record), { lastUpdated: now, createdAt: record.createdAt || now });
            waitFor.push(this.dexieTable.put(newRec));
        });
        await Promise.all(waitFor);
        store.commit(`${this.vuex.moduleName}/${__2.AbcMutation.ABC_FIREBASE_REFRESH_INDEXED_DB}`, serverResults);
    }
    catch (e) {
        store.commit(`${this.vuex.moduleName}/${__2.AbcMutation.ABC_INDEXED_DB_REFRESH_FAILED}`, Object.assign(Object.assign({}, serverResults), { errorMessage: e.message, errorStack: e.stack }));
    }
}
exports.cacheIndexedDB = cacheIndexedDB;
//# sourceMappingURL=getDiscrete.js.map