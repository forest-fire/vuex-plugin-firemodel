
import { Store } from "vuex";
import { FiremodelModule, database } from "./store";
import { IClientConfig, IClientAuth } from "@forest-fire/types";
import { DB, RealTimeClient } from "universal-fire"
import { FireModel } from "firemodel";
import { IDictionary } from "common-types";
import copy from "fast-copy";

import {
  IFiremodelConfig as IFiremodelPluginConfig,
  IFiremodelState,
  IFmQueuedAction,
  FmCallback
} from "./types";
import { FmConfigMutation } from "./types/mutations/FmConfigMutation";
import { FmConfigAction } from "./types/actions/FmConfigActions";
import { FireModelPluginError } from "./errors/FiremodelPluginError";
import { addNamespace } from "./shared/addNamespace";
import { coreServices } from "./coreServices";

export * from "./types";
export * from "./firemodelMutations/index";
export * from "firemodel";
export { database } from "./store";
export * from "./auth/api";
export * from "./abc/index";

export let configuration: IFiremodelPluginConfig<any>;
export let dbConfig: IClientConfig;
export let firemodelVuex: Store<any>;
let _store: Store<any>;
export const setStore = <T>(store: Store<T>) => {
  _store = store;
};
/**
 * Get the Store from elsewhere in the library
 */
export function getStore<T = any>() {
  return _store as Store<T>;
}

let _db: RealTimeClient;
let _auth: IClientAuth;

export async function getAuth() {
  if (!_auth) {
    const db = await database();
    setAuth(await db.auth());
  }

  return _auth;
}

export function setAuth(auth: IClientAuth) {
  _auth = auth;
}

export let initialState: IDictionary;

export type IFiremodel<T> = { "@firemodel": IFiremodelState<T> };

const FiremodelPlugin = <T>(
  config: IFiremodelPluginConfig<T & IFiremodel<T>>
) => {
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

export default FiremodelPlugin;

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
    ["onAuth", "auth-event"],
    ["onLogin", "logged-in"],
    ["onLogout", "logged-out"],
    ["onDisconnect", "disconnected"],
    ["onRouteChange", "route-changed"],
    ["onUserUpgraded", "user-upgraded"]
  ];

  for (const i of iterable) {
    const [name, event] = i;
    if (config[name as keyof IFiremodelPluginConfig<T>]) {
      const cb: FmCallback = config[
        name as keyof IFiremodelPluginConfig<T>
      ] as any;
      store.commit(addNamespace(FmConfigMutation.queueHook), {
        on: event,
        name: `lifecycle-event-${event}`,
        cb
      } as IFmQueuedAction<T>);
    }
  }
}
