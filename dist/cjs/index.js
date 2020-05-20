"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialState = exports.setAuth = exports.getAuth = exports.getStore = exports.setStore = exports.firemodelVuex = exports.dbConfig = exports.configuration = void 0;
const store_1 = require("./store");
const firemodel_1 = require("firemodel");
const fast_copy_1 = __importDefault(require("fast-copy"));
const private_1 = require("./private");
__exportStar(require("./types"), exports);
__exportStar(require("./firemodelMutations/index"), exports);
__exportStar(require("firemodel"), exports);
var store_2 = require("./store");
Object.defineProperty(exports, "database", { enumerable: true, get: function () { return store_2.database; } });
__exportStar(require("./auth/api"), exports);
__exportStar(require("./abc/index"), exports);
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
                store.dispatch(private_1.addNamespace(private_1.FmConfigAction.watchRouteChanges), Object.assign({}, mutation.payload));
            }
        });
        store.registerModule("@firemodel", store_1.FiremodelModule());
        queueLifecycleEvents(store, config).then(() => private_1.coreServices(store, Object.assign({ connect: true }, config)));
    };
};
exports.default = FiremodelPlugin;
async function queueLifecycleEvents(store, config) {
    if (!config) {
        throw new private_1.FireModelPluginError(`There was no configuration sent into the FiremodelPlugin!`, "not-allowed");
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
            store.commit(private_1.addNamespace("QUEUE_EVENT_HOOK" /* queueHook */), {
                on: event,
                name: `lifecycle-event-${event}`,
                cb
            });
        }
    }
}
//# sourceMappingURL=index.js.map