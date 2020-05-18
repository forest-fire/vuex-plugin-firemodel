import { Store } from "vuex";
import { addNamespace, FmConfigAction, FmConfigMutation, IFiremodelConfig, database } from "./private";

/**
 * Based on the configuration passed in by the consuming app, core
 * services will be started by firing off the appropriate Vuex _action_.
 */
export async function coreServices<T>(
  store: Store<T>,
  config?: IFiremodelConfig<T>
) {
  const starting: Promise<any>[] = [];
  if (config?.connect) {
    await database(config?.db);
    console.log("db connected");

    starting.push(
      store.dispatch(addNamespace(FmConfigAction.connect), config.db)
    );
  }

  if (config?.auth) {
    starting.push(
      store.dispatch(addNamespace(FmConfigAction.firebaseAuth), config)
    );
  }

  if (config?.routeChanges) {
    starting.push(
      store.dispatch(addNamespace(FmConfigAction.watchRouteChanges))
    );
  }
  await Promise.all(starting);

  store.commit(addNamespace(FmConfigMutation.coreServicesStarted), {
    message: `all core firemodel plugin services started`,
    config: config?.db
  });
}
