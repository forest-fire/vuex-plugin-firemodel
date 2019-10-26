import { Store } from "vuex";
import { addNamespace } from "./shared/addNamespace";
import { FmConfigAction } from "./types/actions";
import { FmConfigMutation } from "./types/mutations/FmConfigMutation";
import { IFiremodelConfig } from "./types/index";
import { database } from "./store";

/**
 * Based on the configuration passed in by the consuming app, core
 * services will be started by firing off the appropriate Vuex _action_.
 */
export async function coreServices<T>(
  store: Store<T>,
  config: IFiremodelConfig<T>
) {
  const starting: Promise<any>[] = [];
  if (config.connect) {
    await database(config.db);
    console.log("db connected");

    starting.push(
      store.dispatch(addNamespace(FmConfigAction.connect), config.db)
    );
  }

  if (config.useAuth) {
    console.log("using Auth");

    starting.push(
      store.dispatch(addNamespace(FmConfigAction.firebaseAuth), config)
    );
  }

  if (config.watchRouteChanges) {
    starting.push(
      store.dispatch(addNamespace(FmConfigAction.watchRouteChanges))
    );
  }
  await Promise.all(starting);

  // if (config.anonymousAuth) {
  //   await database();
  //   await store.dispatch(addNamespace(FmConfigAction.anonymousLogin), config);
  // }

  store.commit(addNamespace(FmConfigMutation.coreServicesStarted), {
    message: `all core firemodel plugin services started`,
    config: config.db
  });
}
