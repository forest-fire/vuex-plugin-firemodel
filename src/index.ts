import {
  IFiremodelConfig as IFiremodelPluginConfig,
  IFiremodelState,
  IFmQueuedAction,
  FmCallback
} from "./types";
import { Store } from "vuex";
import { FiremodelModule } from "./store";
import { Watch, Record, List, FireModel } from "firemodel";
import { DB, FirebaseAuth } from "abstracted-client";
import { createError, IDictionary } from "common-types";
import { IFirebaseClientConfig, RealTimeDB } from "abstracted-firebase";
import { FmConfigMutation } from "./types/mutations/FmConfigMutation";
import { FmConfigAction } from "./types/actions/FmConfigActions";
export * from "./types";

/**
 * We know that the root state will include the **@firemodel** state tree
 * but otherwise we will accept a generic understanding unless passed
 * more specifics. This interface represents the generic understanding.
 */
export interface IGenericStateTree extends IDictionary {
  "@firemodel": IFiremodelState;
}

export let configuration: IFiremodelPluginConfig;
export let dbConfig: IFirebaseClientConfig;
export let firemodelVuex: Store<any>;
let _db: DB;
let _auth: FirebaseAuth;

export async function getDb(config?: IFirebaseClientConfig): Promise<DB> {
  if (!dbConfig) {
    throw createError(
      "firemodel-plugin/no-configuration",
      `Attempt to instantiate the database without db configuration provided!`
    );
  }

  if (!_db) {
    setDb(await DB.connect(dbConfig));
  }

  return _db;
}

export function setDb(db: DB) {
  db = _db;
}

export async function getAuth() {
  if (!_auth) {
    const db = await getDb();
    setAuth(await db.auth());
  }

  return _auth;
}

export function setAuth(auth: FirebaseAuth) {
  _auth = auth;
}

const FirePlugin = (config?: IFiremodelPluginConfig) => {
  configuration = config;
  return async (store: Store<IGenericStateTree>) => {
    firemodelVuex = store;
    FireModel.dispatch = store.dispatch;

    store.subscribe((mutation, state) => {
      if (mutation.type === "route/ROUTE_CHANGED") {
        // TODO: this looks off
        store.dispatch("@firemodel/watchRouteChanges", {
          Watch,
          Record,
          List,

          dispatch: store.dispatch,
          state: store.state,
          commit: store.commit,

          ...mutation.payload
        });
      }
    });

    store.registerModule("@firemodel", FiremodelModule);
    await queueLifecycleEvents(store, config);
    await coreServices(store, { ...{ connect: true }, ...config });
  };
};

export default FirePlugin;

async function queueLifecycleEvents<T = IGenericStateTree>(
  store: Store<T>,
  config?: IFiremodelPluginConfig
) {
  if (!config) {
    return;
  }
  const iterable = [
    ["onConnect", "connected"],
    ["onLogin", "logged-in"],
    ["onLogout", "logged-out"],
    ["onDisconnect", "disconnected"],
    ["onRouteChange", "route-changed"],
    ["onUserUpgraded", "user-upgraded"]
  ];

  for (const i of iterable) {
    const [name, event] = i;
    if (config[name as keyof IFiremodelPluginConfig]) {
      const empty = () => Promise.resolve();
      const cb: FmCallback = config[name as keyof IFiremodelPluginConfig] as any;
      await store.commit("@firemodel/queue", {
        on: event,
        name: `lifecycle-event-${event}`,
        cb
      } as IFmQueuedAction);
    }
  }
}

async function coreServices<T = IGenericStateTree>(
  store: Store<T>,
  config: IFiremodelPluginConfig
) {
  if (config.connect) {
    await store.dispatch(FmConfigAction.connect, config);
  }

  if (config.watchAuth) {
    await store.dispatch(FmConfigAction.watchAuth, config);
  }

  if (config.anonymousAuth) {
    await store.dispatch(FmConfigAction.anonymousAuth, config);
  }

  if (config.watchRouteChanges) {
    await store.dispatch(FmConfigAction.watchRouteChanges);
  }

  store.commit(FmConfigMutation.coreServicesStarted, {
    message: `all core firemodel plugin services started`,
    config: config.db
  });
}
