import { addNamespace, FmConfigAction, database } from "./private";
/**
 * Based on the configuration passed in by the consuming app, core
 * services will be started by firing off the appropriate Vuex _action_.
 */
export async function coreServices(store, config) {
    const starting = [];
    if (config.connect) {
        await database(config.db);
        console.log("db connected");
        starting.push(store.dispatch(addNamespace(FmConfigAction.connect), config.db));
    }
    if (config.auth) {
        starting.push(store.dispatch(addNamespace(FmConfigAction.firebaseAuth), config));
    }
    if (config.routeChanges) {
        starting.push(store.dispatch(addNamespace(FmConfigAction.watchRouteChanges)));
    }
    await Promise.all(starting);
    store.commit(addNamespace("CORE_SERVICES_STARTED" /* coreServicesStarted */), {
        message: `all core firemodel plugin services started`,
        config: config.db
    });
}
