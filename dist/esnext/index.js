import { FiremodelModule, database } from "./store";
import { FmConfigAction } from "./types/actions/FmConfigActions";
import { FireModelPluginError } from "./errors/FiremodelPluginError";
import { addNamespace } from "./shared/addNamespace";
import { coreServices } from "./coreServices";
import { FireModel } from "firemodel";
import copy from "fast-copy";
export * from "./types";
export * from "./firemodelMutations/index";
export * from "firemodel";
export { database } from "./store";
export * from "./auth/api";
export * from "./abc/index";
export let configuration;
export let dbConfig;
export let firemodelVuex;
let _store;
export const setStore = (store) => {
    _store = store;
};
/**
 * Get the Store from elsewhere in the library
 */
export function getStore() {
    return _store;
}
let _db;
let _auth;
export async function getAuth() {
    if (!_auth) {
        const db = await database();
        setAuth(await db.auth());
    }
    return _auth;
}
export function setAuth(auth) {
    _auth = auth;
}
export let initialState;
const FiremodelPlugin = (config) => {
    configuration = config;
    return (store) => {
        initialState = copy(store.state);
        setStore(store);
        FireModel.dispatch = store.dispatch;
        store.subscribe((mutation, state) => {
            if (mutation.type === "route/ROUTE_CHANGED") {
                store.dispatch(addNamespace(FmConfigAction.watchRouteChanges), Object.assign({}, mutation.payload));
            }
        });
        store.registerModule("@firemodel", FiremodelModule());
        queueLifecycleEvents(store, config).then(() => coreServices(store, Object.assign({ connect: true }, config)));
    };
};
export default FiremodelPlugin;
async function queueLifecycleEvents(store, config) {
    if (!config) {
        throw new FireModelPluginError(`There was no configuration sent into the FiremodelPlugin!`, "not-allowed");
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
            store.commit(addNamespace("QUEUE_EVENT_HOOK" /* queueHook */), {
                on: event,
                name: `lifecycle-event-${event}`,
                cb
            });
        }
    }
}
