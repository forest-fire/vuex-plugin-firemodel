import { addNamespace, FmConfigAction, database } from "./private";
/**
 * Based on the configuration passed in by the consuming app, core
 * services will be started by firing off the appropriate Vuex _action_.
 */
export async function coreServices(store, config) {
    const starting = [];
    if (config === null || config === void 0 ? void 0 : config.connect) {
        if (config.db) {
            await database(config.db);
        }
        else
            console.log("db connected");
        starting.push(store.dispatch(addNamespace(FmConfigAction.connect), config.db));
    }
    if (config === null || config === void 0 ? void 0 : config.auth) {
        starting.push(store.dispatch(addNamespace(FmConfigAction.firebaseAuth), config));
    }
    if (config === null || config === void 0 ? void 0 : config.routeChanges) {
        starting.push(store.dispatch(addNamespace(FmConfigAction.watchRouteChanges)));
    }
    await Promise.all(starting);
    store.commit(addNamespace("CORE_SERVICES_STARTED" /* coreServicesStarted */), {
        message: `all core firemodel plugin services started`,
        config: config === null || config === void 0 ? void 0 : config.db
    });
}
