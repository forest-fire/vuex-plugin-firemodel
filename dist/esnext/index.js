import { FiremodelModule } from "./store";
import { Watch, Record, List, FireModel } from "firemodel";
import { DB } from "abstracted-client";
import { createError } from "common-types";
export let configuration;
export let dbConfig;
export let firemodelVuex;
let _db;
let _auth;
export async function getDb(config) {
    if (!dbConfig) {
        throw createError("firemodel-plugin/no-configuration", `Attempt to instantiate the database without db configuration provided!`);
    }
    if (!_db) {
        setDb(await DB.connect(dbConfig));
    }
    return _db;
}
export function setDb(db) {
    db = _db;
}
export async function getAuth() {
    if (!_auth) {
        const db = await getDb();
        setAuth(await db.auth());
    }
    return _auth;
}
export function setAuth(auth) {
    _auth = auth;
}
const FirePlugin = (config) => {
    configuration = config;
    return async (store) => {
        firemodelVuex = store;
        FireModel.dispatch = store.dispatch;
        store.subscribe((mutation, state) => {
            if (mutation.type === "route/ROUTE_CHANGED") {
                // TODO: this looks off
                store.dispatch("@firemodel/watchRouteChanges", Object.assign({ Watch,
                    Record,
                    List, dispatch: store.dispatch, state: store.state, commit: store.commit }, mutation.payload));
            }
        });
        store.registerModule("@firemodel", FiremodelModule);
        await queueLifecycleEvents(store, config);
        await coreServices(store, Object.assign({ connect: true }, config));
    };
};
export default FirePlugin;
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
