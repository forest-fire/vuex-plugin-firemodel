import { IFirebaseConfig } from "abstracted-firebase";
import { Watch, Model, IModelOptions, Record, List, ICompositeKey } from "firemodel";
import { DB } from "abstracted-client";
import { Dispatch, Commit } from "vuex";
import { IRootState } from "..";
import { IDictionary, timestring, datetime, epoch } from "common-types";
import actionTriggers from "../action-triggers";

export * from "./firemodel";

export interface IFmEventContext {
  Watch: typeof Watch;
  Record: typeof Record;
  List: typeof List;
  db?: DB;
  dispatch: Dispatch;
  commit: Commit;
  state: IRootState;
}

export interface IFmUserInfo {
  uid: string;
  isAnonymous: boolean;
  email?: string | null;
  emailVerified: boolean;
}
export interface IFmAuthEventContext extends IFmEventContext, IFmUserInfo {}

export interface IFmLoginUpgradeEventContext extends IFmEventContext {
  uids: {
    before: {
      isAnonymous: boolean;
      uid: string;
    };
    after: {
      isAnonymous: boolean;
      uid: string;
    };
  };
}

export interface IFmRouteEventContext extends IFmEventContext {
  leaving: string;
  entering: string;
}

export type FmCallback = () => Promise<void>;

export type IFmSetupPlugin = (ctx: typeof actionTriggers) => FmCallback[];
export type IFmOnConnect = (ctx: IFmEventContext) => Promise<void>;
export type IFmOnDisconnect = (ctx: IFmEventContext) => Promise<void>;
export type IFmOnLogin = (ctx: IFmAuthEventContext) => Promise<void>;
export type IFmOnLogout = (ctx: IFmAuthEventContext) => Promise<void>;
export type IFmUserUpgrade = (ctx: IFmLoginUpgradeEventContext) => Promise<void>;
export type IFmRouteChanged = (ctx: IFmRouteEventContext) => Promise<void>;

export interface IFireModelConfig {
  /** returns an array of callbacks for setting up this plugin */
  setup: (ctx: typeof actionTriggers) => FmCallback[];
  /**
   * A callback function which is executed any time the
   * database is connected
   */
  onConnect?: IFmOnConnect;
  /**
   * A callback function which is executed when the
   * database is disconnected
   */
  onDisconnect?: IFmOnDisconnect;
  /**
   * A callback function which is executed when firebase
   * logs in; this is true for both anonymous and known
   * users
   */
  onLogin?: IFmOnLogin;
  /**
   * A callback function which is executed when firebase
   * is logged out of (aka, not authenticated)
   */
  onLogout?: IFmOnLogout;
  /**
   * A callback function which is executed when firebase
   * upgrades an "anonymous" user to a "known" user
   */
  onUserUpgrade?: IFmUserUpgrade;
  /**
   * the path in the state tree where the "route" can be found;
   * it defaults to "route"
   */
  pathToRouterSync?: "route" | string;
  /**
   * A callback function which is executed every time the
   */
  onRouteChange?: IFmRouteChanged;
}

export type IFmEventActions = "add" | "update" | "remove";

export interface IFmLocalChange<T extends Model = Model> {
  /** the location in the database */
  dbPath: string;
  /** the CRUD action */
  action: IFmEventActions;
  /** the location in local state management */
  localPath: string;
  /** prior value of what has been changed locally */
  priorValue: T;
  /** the new value that has been set locally */
  value: T;
  /** when the local change was made */
  timestamp: epoch;
}

export type IFmModelConstructor<T extends Model = Model> = new () => T;
export type IFmLifecycleEvents =
  | "connected"
  | "disconnected"
  | "logged-in"
  | "logged-out"
  | "user-upgraded"
  | "route-changed";

export interface IFmQueuedAction<T extends IFmEventContext = IFmEventContext> {
  /** a descriptive name for the queued action */
  name: string;
  /**
   * Lifecycle events which will trigger the
   * given queued action
   */
  on?: IFmLifecycleEvents;
  /** the callback function */
  cb: IFmQueueCallaback<T>;
  /**
   * if this action was run but resulted in an error then
   * the error will be captured here
   */
  errorMessage?: string;
  errorStack?: string[];
}

export interface IFmWatchItem {
  /** the id assigned to the watcher when started */
  watchId: string;
  /** the database path where the record is found */
  dbPath: string;
  /** where in the local state tree this record should be synced */
  localPath: string;
}

export type IFmQueueCallaback<T extends IFmEventContext> = (ctx: T) => Promise<void>;

export interface IFmActionWatchRecord {
  id: string;
  model: IFmModelConstructor;
  options: IModelOptions;
  on: IFmLifecycleEvents;
}

export interface IRouteSyncChange {
  readonly path: string;
  readonly params: IDictionary;
  readonly query: IDictionary;
}

export interface IRouteState {
  fullPath: string;
  hash: string;
  meta: IDictionary;
  name: string | null;
  params: IDictionary;
  path: string;
  query: IDictionary;
}
