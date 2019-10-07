import { addNamespace } from "./shared/addNamespace";
import { FmConfigAction } from "./types/actions";
/**
 * Based on the configuration passed in by the consuming app, core
 * services will be started by firing off the appropriate Vuex _action_.
 */
export async function coreServices(store, config) {
    if (config.connect) {
        await store.dispatch(addNamespace(FmConfigAction.connect), config.db);
    }
    if (config.useAuth) {
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
