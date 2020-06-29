import { FiremodelModule, FmConfigAction, coreServices, queueLifecycleEvents, setInitialState, storeDatabase, storePluginConfig } from "./private";
import { addNamespace, } from "./shared";
import { FireModel } from "firemodel";
import copy from "fast-copy";
import { preserveStore } from "./state-mgmt";
/**
 * **FiremodelPlugin**
 *
 * @param db the database connection (provided by SDK from `universal-fire`)
 * @param config the configuration of the core services this plugin provides
 */
export const FiremodelPlugin = (
/**
 * Provide a connection to the database with one of the SDK's provided
 * by the `universal-fire` library.
 */
db, 
/**
 * Specify the configuration of the "core services" this plugin provides
 */
config) => {
    storeDatabase(db);
    storePluginConfig(config);
    return (store) => {
        setInitialState(copy(store.state));
        preserveStore(store);
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
