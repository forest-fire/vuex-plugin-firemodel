import {
  IFiremodelConfig as IFiremodelPluginConfig,
  IFiremodelState,
  IFmQueuedAction,
  FmCallback
} from "./types";
import { Store } from "vuex";
import { FiremodelModule, database } from "./store";
import { DB, IFirebaseClientConfig } from "abstracted-client";
import { FmConfigMutation } from "./types/mutations/FmConfigMutation";
import { FmConfigAction } from "./types/actions/FmConfigActions";
import { FireModelPluginError } from "./errors/FiremodelPluginError";
import { addNamespace } from "./shared/addNamespace";
import { coreServices } from "./coreServices";
import { FirebaseAuth } from "@firebase/auth-types";
import { FireModel, Watch, Record, List } from "firemodel";
import { IDictionary } from "firemock";
import copy from "fast-copy";

export * from "./types";
export * from "./firemodelMutations/index";
export * from "firemodel";
export { database } from "./store";
export * from "./auth/api";
export * from "./abc/index"

export let configuration: IFiremodelPluginConfig<any>;
export let dbConfig: IFirebaseClientConfig;
export let firemodelVuex: Store<any>;
let _store: Store<any>;
export const setStore = <T>(store: Store<T>) => {
  _store = store;
};
export function getStore<T = any>() {
  return _store as Store<T>;
}

let _db: DB;
let _auth: FirebaseAuth;

export async function getAuth() {
  if (!_auth) {
    const db = await database();
    setAuth(await db.auth());
  }

  return _auth;
}

export function setAuth(auth: FirebaseAuth) {
  _auth = auth;
}

export let initialState: IDictionary;

export type IFiremodel<T> = { "@firemodel": IFiremodelState<T> };

const FirePlugin = <T>(config: IFiremodelPluginConfig<T & IFiremodel<T>>) => {
  configuration = config;
  type IRootState = T & { "@firemodel": IFiremodelState<T> };
  return (store: Store<IRootState>) => {
    initialState = copy(store.state);
    setStore(store);
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

export default FirePlugin;

async function queueLifecycleEvents<T>(
  store: Store<T>,
  config?: IFiremodelPluginConfig<T>
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
    if (config[name as keyof IFiremodelPluginConfig<T>]) {
      const empty = () => Promise.resolve();
      const cb: FmCallback = config[
        name as keyof IFiremodelPluginConfig<T>
      ] as any;
      await store.commit(addNamespace(FmConfigMutation.queueHook), {
        on: event,
        name: `lifecycle-event-${event}`,
        cb
      } as IFmQueuedAction<T>);
    }
  }
}
