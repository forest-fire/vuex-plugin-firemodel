import { FiremodelModule } from "./store";
import { Watch, Record, List, FireModel } from "firemodel";
import { DB } from "abstracted-client";
import { createError } from "common-types";
import { FmConfigAction } from "./types/actions/FmConfigActions";
import { FireModelPluginError } from "./errors/FiremodelPluginError";
import { addNamespace } from "./shared/addNamespace";
export * from "./firemodelMutations/index";
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
    return (store) => {
        firemodelVuex = store;
        FireModel.dispatch = store.dispatch;
        store.subscribe((mutation, state) => {
            if (mutation.type === "route/ROUTE_CHANGED") {
                store.dispatch(addNamespace(FmConfigAction.watchRouteChanges), Object.assign({ Watch,
                    Record,
                    List, dispatch: store.dispatch, state: store.state, commit: store.commit }, mutation.payload));
            }
        });
        store.registerModule("@firemodel", FiremodelModule);
        queueLifecycleEvents(store, config).then(() => coreServices(store, Object.assign({ connect: true }, config)));
    };
};
export default FirePlugin;
async function queueLifecycleEvents(store, config) {
    if (!config) {
        throw new FireModelPluginError(`There was no configuration sent into the FiremodelPlugin!`, "not-allowed");
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
            await store.commit(addNamespace("QUEUE_EVENT_HOOK" /* queueHook */), {
                on: event,
                name: `lifecycle-event-${event}`,
                cb
            });
        }
    }
}
async function coreServices(store, config) {
    if (config.connect) {
        await store.dispatch(addNamespace(FmConfigAction.connect), config.db);
    }
    if (config.watchAuth) {
        await store.dispatch(addNamespace(FmConfigAction.firebaseAuth), config);
    }
    if (config.anonymousAuth) {
        await store.dispatch(addNamespace(FmConfigAction.anonymousLogin), config);
    }
    if (config.watchRouteChanges) {
        await store.dispatch(addNamespace(FmConfigAction.watchRouteChanges));
    }
    store.commit(addNamespace("CORE_SERVICES_STARTED" /* coreServicesStarted */), {
        message: `all core firemodel plugin services started`,
        config: config.db
    });
}
