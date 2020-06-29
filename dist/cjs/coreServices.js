"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coreServices = void 0;
const private_1 = require("./private");
const shared_1 = require("./shared");
/**
 * Based on the configuration passed in by the consuming app, core
 * services will be started by firing off the appropriate Vuex _action_.
 */
async function coreServices(store, config) {
    const db = private_1.getDatabase();
    const starting = [];
    // CONNECT
    if (config === null || config === void 0 ? void 0 : config.connect) {
        if (!db.isConnected) {
            await db.connect();
        }
        // run connect action
        starting.push(store.dispatch(shared_1.addNamespace(private_1.FmConfigAction.connect), private_1.getDatabase()));
    }
    // AUTH
    if (config === null || config === void 0 ? void 0 : config.auth) {
        // run auth action
        starting.push(store.dispatch(shared_1.addNamespace(private_1.FmConfigAction.firebaseAuth), config));
    }
    if (config === null || config === void 0 ? void 0 : config.routeChanges) {
        // run routeChanges action
        starting.push(store.dispatch(shared_1.addNamespace(private_1.FmConfigAction.watchRouteChanges)));
    }
    await Promise.all(starting);
    store.commit(shared_1.addNamespace("CORE_SERVICES_STARTED" /* coreServicesStarted */), {
        message: `all core firemodel plugin services started`,
        config: db.config
    });
}
exports.coreServices = coreServices;
//# sourceMappingURL=coreServices.js.map