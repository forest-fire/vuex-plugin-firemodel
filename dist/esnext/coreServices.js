import { addNamespace, FmConfigAction, database } from "./private";
/**
 * Based on the configuration passed in by the consuming app, core
 * services will be started by firing off the appropriate Vuex _action_.
 */
export async function coreServices(store, config) {
    const db = database();
    const starting = [];
    // CONNECT
    if (config === null || config === void 0 ? void 0 : config.connect) {
        if (!db.isConnected) {
            await db.connect();
        }
        // run connect action
        starting.push(store.dispatch(addNamespace(FmConfigAction.connect), database()));
    }
    // AUTH
    if (config === null || config === void 0 ? void 0 : config.auth) {
        // run auth action
        starting.push(store.dispatch(addNamespace(FmConfigAction.firebaseAuth), config));
    }
    if (config === null || config === void 0 ? void 0 : config.routeChanges) {
        // run routeChanges action
        starting.push(store.dispatch(addNamespace(FmConfigAction.watchRouteChanges)));
    }
    await Promise.all(starting);
    store.commit(addNamespace("CORE_SERVICES_STARTED" /* coreServicesStarted */), {
        message: `all core firemodel plugin services started`,
        config: db.config
    });
}
