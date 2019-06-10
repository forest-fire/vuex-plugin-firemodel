import { IFirebaseClientConfig } from "abstracted-firebase";
import { Watch, Model, IModelOptions, Record, List } from "firemodel";
import { DB } from "abstracted-client";
import { Dispatch, Commit } from "vuex";
import { IDictionary, epoch } from "common-types";
import actionTriggers from "../action-triggers";
import { IGenericStateTree } from "..";
export * from "./firemodel";
export interface IFmEventContext<T = IGenericStateTree> {
    Watch: typeof Watch;
    Record: typeof Record;
    List: typeof List;
    db?: DB;
    dispatch: Dispatch;
    commit: Commit;
    state: T;
}
export interface IFmUserInfo {
    uid: string;
    isAnonymous: boolean;
    email?: string | null;
    emailVerified: boolean;
}
export interface IFmAuthEventContext extends IFmEventContext, IFmUserInfo {
}
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
export declare type FmCallback = () => Promise<void>;
export declare type IFmSetupPlugin = (ctx: typeof actionTriggers) => FmCallback[];
export declare type IFmOnConnect = (ctx: IFmEventContext) => Promise<void>;
export declare type IFmOnDisconnect = (ctx: IFmEventContext) => Promise<void>;
export declare type IFmOnLogin = (ctx: IFmAuthEventContext) => Promise<void>;
export declare type IFmOnLogout = (ctx: IFmAuthEventContext) => Promise<void>;
export declare type IFmUserUpgrade = (ctx: IFmLoginUpgradeEventContext) => Promise<void>;
export declare type IFmRouteChanged = (ctx: IFmRouteEventContext) => Promise<void>;
/**
 * **Firemodel Config**
 *
 * This configuration requires that you provide a means to connect to the DB
 * and then allows you to do two things:
 *
 * 1. Turn on/off core services of this plugin
 * 2. Hook into _lifecycle_ events (typically to watch/unwatch certain db paths)
 */
export interface IFiremodelConfig extends IFiremodelLifecycleHooks, IFiremodelPluginCoreServices {
    /**
     * Firemodel must be able to connect to the database -- using
     * `abstracted-client` to do so -- and therefore the configuration
     * must include either a Firebase Config (and this plugin will
     * create an instance of `abstracted-client`) or you can just pass
     * in an instance of abstracted client here as well.
     */
    db: IFirebaseClientConfig;
    /**
     * A flag which which determines whether the database connection should be
     * established immediately on this plugin's initialization.
     *
     * Default is `true`
     */
    connect?: boolean;
}
export interface IFiremodelPluginCoreServices {
    /**
     * **Watch Auth**
     *
     * As soon as the database connects this service will
     * hook into Firebase's events around changes in
     * _authentication_ status. This opens up the `onAuthChanged`
     * lifecycle event provided as part of this plugin.
     *
     * Typically you **will** want
     * to enable this if you are using Firemodel's Identity/Auth
     * system. If you aren't then it follows that you
     * WOULD NOT enable it.
     *
     * If not stated, this option defaults to `false`.
     */
    watchAuth?: boolean;
    /**
     * **Anonymous Auth**
     *
     * Once Firebase has connected to the DB, this service
     * will ensure that the user is logged in. Of course if
     * a user already had a valid token/session then it's
     * normal for **Firebase** to reconnect you but in the
     * cases where there is no valid token, this service will
     * login the user as an _anonymous_ user.
     *
     * If not stated, this option defaults to `false`.
     */
    anonymousAuth?: boolean;
    /**
     * **Watch Route Changes**
     *
     * if your project is using the popular vuex plugin
     */
    watchRouteChanges?: boolean;
}
export interface IFiremodelLifecycleHooks {
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
export declare type IFmEventActions = "add" | "update" | "remove";
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
export declare type IFmModelConstructor<T extends Model = Model> = new () => T;
export declare type IFmLifecycleEvents = "connected" | "disconnected" | "logged-in" | "logged-out" | "user-upgraded" | "route-changed";
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
export declare type IFmQueueCallaback<T extends IFmEventContext> = (ctx: T) => Promise<void>;
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
