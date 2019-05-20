import { IFireModelConfig, IFiremodelState, IFmQueuedAction, FmCallback } from "./types";
import { Store } from "vuex";
import { IRootState } from "../index";
import FireModule from "./fireModule";
import { Watch, Record, List, FireModel } from "firemodel";
import actionTriggers from "./action-triggers";
import { DB, FirebaseAuth } from "abstracted-client";
import env from "@/env";
import { createError } from "common-types";
import { IFirebaseConfig } from "abstracted-firebase";

export let configuration: IFireModelConfig;
export let firemodelVuex: Store<IRootState>;
let _db: DB;
let _auth: FirebaseAuth;

export async function getDb(config?: IFirebaseConfig): Promise<DB> {
  if (!_db && (!config || env().firemodel)) {
    throw createError(
      "firemodel-plugin/no-configuration",
      `Attempt to instantiate the database with any configuration provided!`
    );
  }

  if (!_db) {
    setDb(await DB.connect(config || env().firemodel));
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

const FirePlugin = (config?: IFireModelConfig) => {
  return async (store: Store<IRootState>) => {
    configuration = config || { setup: ctx => [] };
    firemodelVuex = store;
    FireModel.dispatch = store.dispatch;

    store.subscribe((mutation, state) => {
      if (mutation.type === "route/ROUTE_CHANGED") {
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

    store.registerModule("@firemodel", FireModule);
    await queueLifecycleEvents(store, config);
    await setupPluginConfig(store, config);
  };
};

export default FirePlugin;

async function queueLifecycleEvents(store: Store<IRootState>, config?: IFireModelConfig) {
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
    if (config[name as keyof IFireModelConfig]) {
      const empty = () => Promise.resolve();
      const cb: FmCallback = config[name as keyof IFireModelConfig] as any;
      await store.commit("@firemodel/queue", {
        on: event,
        name: `lifecycle-event-${event}`,
        cb
      } as IFmQueuedAction);
    }
  }
}

async function setupPluginConfig(store: Store<IRootState>, config?: IFireModelConfig) {
  if (config && config.setup) {
    const setup = config.setup(actionTriggers) || [];
    for (const i of setup) {
      await i();
    }
  }
  store.commit("@firemodel/pluginSetupComplete", {
    message: `${
      config ? Object.keys(config.setup(actionTriggers)).length : 0
    } config/setup options used`
  });
}
