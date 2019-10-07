import {
  IFiremodelConfig as IFiremodelPluginConfig,
  IFiremodelState,
  IFmQueuedAction,
  FmCallback
} from "./types";
import { Store } from "vuex";
import { FiremodelModule, database } from "./store";
import { Watch, Record, List, FireModel } from "firemodel";
import { DB, FirebaseAuth, IFirebaseClientConfig } from "abstracted-client";
import { FmConfigMutation } from "./types/mutations/FmConfigMutation";
import { FmConfigAction } from "./types/actions/FmConfigActions";
import { FireModelPluginError } from "./errors/FiremodelPluginError";
import { addNamespace } from "./shared/addNamespace";
import { coreServices } from "./coreServices";
export * from "./types";
export * from "./firemodelMutations/index";
export * from "firemodel";
export { database } from "./store";

export let configuration: IFiremodelPluginConfig<any>;
export let dbConfig: IFirebaseClientConfig;
export let firemodelVuex: Store<any>;
let _store;
export const setStore = <T>(store: Store<T>) => {
  _store = store;
};

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

export type IFiremodel<T> = { "@firemodel": IFiremodelState<T> };

const FirePlugin = <T>(config: IFiremodelPluginConfig<T & IFiremodel<T>>) => {
  configuration = config;
  type IRootState = T & { "@firemodel": IFiremodelState<T> };
  return (store: Store<IRootState>) => {
    setStore(store);
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
