"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = require("./store");
const FmConfigActions_1 = require("./types/actions/FmConfigActions");
const FiremodelPluginError_1 = require("./errors/FiremodelPluginError");
const addNamespace_1 = require("./shared/addNamespace");
const coreServices_1 = require("./coreServices");
const firemodel_1 = require("firemodel");
const fast_copy_1 = __importDefault(require("fast-copy"));
__export(require("./types"));
__export(require("./firemodelMutations/index"));
__export(require("firemodel"));
var store_2 = require("./store");
exports.database = store_2.database;
__export(require("./auth/api"));
__export(require("./abc/index"));
let _store;
exports.setStore = (store) => {
    _store = store;
};
/**
 * Get the Store from elsewhere in the library
 */
function getStore() {
    return _store;
}
exports.getStore = getStore;
let _db;
let _auth;
async function getAuth() {
    if (!_auth) {
        const db = await store_1.database();
        setAuth(await db.auth());
    }
    return _auth;
}
exports.getAuth = getAuth;
function setAuth(auth) {
    _auth = auth;
}
exports.setAuth = setAuth;
const FiremodelPlugin = (config) => {
    exports.configuration = config;
    return (store) => {
        exports.initialState = fast_copy_1.default(store.state);
        exports.setStore(store);
        firemodel_1.FireModel.dispatch = store.dispatch;
        store.subscribe((mutation, state) => {
            if (mutation.type === "route/ROUTE_CHANGED") {
                store.dispatch(addNamespace_1.addNamespace(FmConfigActions_1.FmConfigAction.watchRouteChanges), Object.assign({}, mutation.payload));
            }
        });
        store.registerModule("@firemodel", store_1.FiremodelModule());
        queueLifecycleEvents(store, config).then(() => coreServices_1.coreServices(store, Object.assign({ connect: true }, config)));
    };
};
exports.default = FiremodelPlugin;
async function queueLifecycleEvents(store, config) {
    if (!config) {
        throw new FiremodelPluginError_1.FireModelPluginError(`There was no configuration sent into the FiremodelPlugin!`, "not-allowed");
        return;
    }
    const iterable = [
        ["onConnect", "connected"],
        ["onAuth", "auth-event"],
        ["onLogin", "logged-in"],
        ["onLogout", "logged-out"],
        ["onDisconnect", "disconnected"],
        ["onRouteChange", "route-changed"],
        ["onUserUpgraded", "user-upgraded"]
    ];
    for (const i of iterable) {
        const [name, event] = i;
        if (config[name]) {
            const cb = config[name];
            store.commit(addNamespace_1.addNamespace("QUEUE_EVENT_HOOK" /* queueHook */), {
                on: event,
                name: `lifecycle-event-${event}`,
                cb
            });
        }
    }
}
//# sourceMappingURL=index.js.map