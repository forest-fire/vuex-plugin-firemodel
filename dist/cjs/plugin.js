"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FiremodelPlugin = void 0;
const private_1 = require("./private");
const shared_1 = require("./shared");
const firemodel_1 = require("firemodel");
const fast_copy_1 = __importDefault(require("fast-copy"));
const state_mgmt_1 = require("./state-mgmt");
/**
 * **FiremodelPlugin**
 *
 * @param db the database connection (provided by SDK from `universal-fire`)
 * @param config the configuration of the core services this plugin provides
 */
exports.FiremodelPlugin = (
/**
 * Provide a connection to the database with one of the SDK's provided
 * by the `universal-fire` library.
 */
db, 
/**
 * Specify the configuration of the "core services" this plugin provides
 */
config) => {
    private_1.storeDatabase(db);
    private_1.storePluginConfig(config);
    return (store) => {
        private_1.setInitialState(fast_copy_1.default(store.state));
        state_mgmt_1.preserveStore(store);
        firemodel_1.FireModel.dispatch = store.dispatch;
        store.subscribe((mutation, state) => {
            if (mutation.type === "route/ROUTE_CHANGED") {
                store.dispatch(shared_1.addNamespace(private_1.FmConfigAction.watchRouteChanges), Object.assign({}, mutation.payload));
            }
        });
        store.registerModule("@firemodel", private_1.FiremodelModule());
        private_1.queueLifecycleEvents(store, config).then(() => private_1.coreServices(store, Object.assign({ connect: true }, config)));
    };
};
//# sourceMappingURL=plugin.js.map