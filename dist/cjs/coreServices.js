"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coreServices = void 0;
const private_1 = require("./private");
/**
 * Based on the configuration passed in by the consuming app, core
 * services will be started by firing off the appropriate Vuex _action_.
 */
async function coreServices(store, config) {
    const starting = [];
    if (config === null || config === void 0 ? void 0 : config.connect) {
        if (config.db) {
            await private_1.database(config.db);
        }
        else
            console.log("db connected");
        starting.push(store.dispatch(private_1.addNamespace(private_1.FmConfigAction.connect), config.db));
    }
    if (config === null || config === void 0 ? void 0 : config.auth) {
        starting.push(store.dispatch(private_1.addNamespace(private_1.FmConfigAction.firebaseAuth), config));
    }
    if (config === null || config === void 0 ? void 0 : config.routeChanges) {
        starting.push(store.dispatch(private_1.addNamespace(private_1.FmConfigAction.watchRouteChanges)));
    }
    await Promise.all(starting);
    store.commit(private_1.addNamespace("CORE_SERVICES_STARTED" /* coreServicesStarted */), {
        message: `all core firemodel plugin services started`,
        config: config === null || config === void 0 ? void 0 : config.db
    });
}
exports.coreServices = coreServices;
//# sourceMappingURL=coreServices.js.map