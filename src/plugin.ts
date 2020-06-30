import { FmConfigAction, IFiremodelConfig, IVuexState, FiremodelModule} from "@/types";
import { addNamespace, setInitialState, storeDatabase, storePluginConfig, } from "@/util";
import { coreServices, queueLifecycleEvents } from "@/private"

import { FireModel } from "firemodel";
import type { IAbstractedDatabase } from "universal-fire";
import type { Store } from "vuex";
import copy from "fast-copy";
import { preserveStore } from "@/util";

export type IFiremodelVuexModule<T> = { "@firemodel": IVuexState<T> };

/**
 * **FiremodelPlugin**
 * 
 * @param db the database connection (provided by SDK from `universal-fire`)
 * @param config the configuration of the core services this plugin provides
 */
export const FiremodelPlugin = <T>(
  /** 
   * Provide a connection to the database with one of the SDK's provided
   * by the `universal-fire` library.
   */
  db: IAbstractedDatabase,
  /**
   * Specify the configuration of the "core services" this plugin provides 
   */
  config: IFiremodelConfig<T & IFiremodelVuexModule<T>>,
) => {
  storeDatabase(db);
  storePluginConfig(config);
  type IRootState = T & { "@firemodel": IVuexState<T> };
  return (store: Store<IRootState>) => {
    setInitialState(copy( store.state ));
    preserveStore(store)
    FireModel.dispatch = store.dispatch;

    store.subscribe((mutation, state) => {
      if (mutation.type === "route/ROUTE_CHANGED") {
        store.dispatch(addNamespace(FmConfigAction.watchRouteChanges), {
          ...mutation.payload
        });
      }
    });

    store.registerModule("@firemodel", FiremodelModule<IRootState>());

    queueLifecycleEvents<IRootState>(store, config).then(() =>
      coreServices(store, { ...{ connect: true }, ...config })
    );
  };
};

