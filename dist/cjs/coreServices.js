"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const addNamespace_1 = require("./shared/addNamespace");
const actions_1 = require("./types/actions");
/**
 * Based on the configuration passed in by the consuming app, core
 * services will be started by firing off the appropriate Vuex _action_.
 */
async function coreServices(store, config) {
    if (config.connect) {
        await store.dispatch(addNamespace_1.addNamespace(actions_1.FmConfigAction.connect), config.db);
    }
    if (config.useAuth) {
        await store.dispatch(addNamespace_1.addNamespace(actions_1.FmConfigAction.firebaseAuth), config);
    }
    if (config.anonymousAuth) {
        await store.dispatch(addNamespace_1.addNamespace(actions_1.FmConfigAction.anonymousLogin), config);
    }
    if (config.watchRouteChanges) {
        await store.dispatch(addNamespace_1.addNamespace(actions_1.FmConfigAction.watchRouteChanges));
    }
    store.commit(addNamespace_1.addNamespace("CORE_SERVICES_STARTED" /* coreServicesStarted */), {
        message: `all core firemodel plugin services started`,
        config: config.db
    });
}
exports.coreServices = coreServices;
//# sourceMappingURL=coreServices.js.map