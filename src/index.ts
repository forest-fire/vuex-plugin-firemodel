import {
  IFiremodelConfig as IFiremodelPluginConfig,
  IFiremodelState,
  IFmQueuedAction,
  FmCallback
} from "./types";
import { Store } from "vuex";
import { FiremodelModule } from "./store";
import { Watch, Record, List, FireModel } from "firemodel";
import { DB, FirebaseAuth, IFirebaseClientConfig } from "abstracted-client";
import { createError, IDictionary } from "common-types";
import { FmConfigMutation } from "./types/mutations/FmConfigMutation";
import { FmConfigAction } from "./types/actions/FmConfigActions";
import { FireModelPluginError } from "./errors/FiremodelPluginError";
import { addNamespace } from "./shared/addNamespace";
export * from "./types";
export * from "./firemodelMutations/index";
export * from "firemodel";

/**
 * We know that the root state will include the **@firemodel** state tree
 * but otherwise we will accept a generic understanding of the rest of the
 * state tree as this plugin has no means of leveraging any specifics.
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

const FirePlugin = (config: IFiremodelPluginConfig) => {
  configuration = config;
  return (store: Store<any>) => {
    firemodelVuex = store;
    FireModel.dispatch = store.dispatch;

    store.subscribe((mutation, state) => {
      if (mutation.type === "route/ROUTE_CHANGED") {
        store.dispatch(addNamespace(FmConfigAction.watchRouteChanges), {
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
    queueLifecycleEvents(store, config).then(() =>
      coreServices(store, { ...{ connect: true }, ...config })
    );
  };
};

export default FirePlugin;

async function queueLifecycleEvents<T = IGenericStateTree>(
  store: Store<T>,
  config?: IFiremodelPluginConfig
) {
  if (!config) {
    throw new FireModelPluginError(
      `There was no configuration sent into the FiremodelPlugin!`,
      "not-allowed"
    );
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
      const cb: FmCallback = config[
        name as keyof IFiremodelPluginConfig
      ] as any;
      await store.commit(addNamespace(FmConfigMutation.queueHook), {
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

  store.commit(addNamespace(FmConfigMutation.coreServicesStarted), {
    message: `all core firemodel plugin services started`,
    config: config.db
  });
}
