import {
  AuthCredential,
  IClientConfig,
  IdTokenResult,
  User
} from "universal-fire";
import { ICurrentUser, IFmQueuedAction } from "@/types";
import { IFmLocalEvent, IWatcherEventContext } from "firemodel";

import { IDictionary } from "common-types";

export interface IFiremodelAbbreviatedUser {
  uid: string;
  isAnonymous: boolean;
  email: string | null;
  emailVerified: boolean;
  fullProfile: User;
}

export interface IFiremodelState<T> {
  /** the configuration used to connect to the Firebase DB */
  config?: IClientConfig;
  /** a list of custom claims that this user has */
  claims?: IDictionary;
  /** the Auth tokenId and associated properties; which includes "custom claims" */
  token?: IdTokenResult;
  /**
   * the authentication status of the user; default state is _undefined_ until
   * the appropriatate state can be established as soon as the Firebase SDK loads and indicates
   * it's status.
   */
  authenticated: undefined | false | "anonymous" | "logged-in";
  /** the AuthCredential received when logging in */
  userCredential?: AuthCredential;
  currentUser?: ICurrentUser;
  /** the DB connection status */
  status:
    | "unconfigured"
    | "connecting"
    | "disconnected"
    | "connected"
    | "error";
  /**
   * callbacks which are queued to be executed when a lifecycle state is achieved
   */
  queued: IFmQueuedAction<T>[];
  /** which DB paths are being watched */
  watching: IWatcherEventContext[];
  /**
   * Records or relationships which have been updated _locally_ but are awaiting
   * confirmation from the database. Each entry is offset by the `transactionId`
   * which **Firemodel** provides.
   */
  localOnly: IDictionary<IFmLocalEvent<T>>;
  /** if there was an error the the message will be displayed here */
  errors?: string[];

  /** an array of ListWatchers which are temporarily muted */
  muted: string[];
}
