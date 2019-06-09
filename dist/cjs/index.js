"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = require("./store");
const firemodel_1 = require("firemodel");
const abstracted_client_1 = require("abstracted-client");
const common_types_1 = require("common-types");
let _db;
let _auth;
async function getDb(config) {
    if (!exports.dbConfig) {
        throw common_types_1.createError("firemodel-plugin/no-configuration", `Attempt to instantiate the database without db configuration provided!`);
    }
    if (!_db) {
        setDb(await abstracted_client_1.DB.connect(exports.dbConfig));
    }
    return _db;
}
exports.getDb = getDb;
function setDb(db) {
    db = _db;
}
exports.setDb = setDb;
async function getAuth() {
    if (!_auth) {
        const db = await getDb();
        setAuth(await db.auth());
    }
    return _auth;
}
exports.getAuth = getAuth;
function setAuth(auth) {
    _auth = auth;
}
exports.setAuth = setAuth;
const FirePlugin = (config) => {
    exports.configuration = config;
    return async (store) => {
        exports.firemodelVuex = store;
        firemodel_1.FireModel.dispatch = store.dispatch;
        store.subscribe((mutation, state) => {
            if (mutation.type === "route/ROUTE_CHANGED") {
                // TODO: this looks off
                store.dispatch("@firemodel/watchRouteChanges", Object.assign({ Watch: firemodel_1.Watch,
                    Record: firemodel_1.Record,
                    List: firemodel_1.List, dispatch: store.dispatch, state: store.state, commit: store.commit }, mutation.payload));
            }
        });
        store.registerModule("@firemodel", store_1.FiremodelModule);
        await queueLifecycleEvents(store, config);
        // await connectToDatabase(store, config);
        await coreServices(store, config);
    };
};
exports.default = FirePlugin;
async function queueLifecycleEvents(store, config) {
    if (!config) {
        return;
    }
    const iterable = [
        ["onConnect", "connected"],
        ["onLogin", "logged-in"],
        ["onLogout", "logged-out"],
        ["onDisconnect", "disconnected"],
        ["onRouteChange", "route-changed"],
        ["onUserUpgraded", "user-upgraded"]
    ];
    for (const i of iterable) {
        const [name, event] = i;
        if (config[name]) {
            const empty = () => Promise.resolve();
            const cb = config[name];
            await store.commit("@firemodel/queue", {
                on: event,
                name: `lifecycle-event-${event}`,
                cb
            });
        }
    }
}
async function coreServices(store, config) {
    if (config.connect) {
        await store.dispatch("connect" /* connect */, config);
    }
    if (config.watchAuth) {
        await store.dispatch("watchAuth" /* watchAuth */, config);
    }
    if (config.anonymousAuth) {
        await store.dispatch("anonymousAuth" /* anonymousAuth */, config);
    }
    if (config.watchRouteChanges) {
        await store.dispatch("watchRouteChanges" /* watchRouteChanges */);
    }
    store.commit("@firemodel/CORE_SERVICES_STARTED" /* coreServicesStarted */, {
        message: `all core firemodel plugin services started`,
        config: config.db
    });
}
//# sourceMappingURL=index.js.map