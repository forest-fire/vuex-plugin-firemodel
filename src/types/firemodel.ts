import { IFirebaseClientConfig } from "abstracted-firebase";
import { IFmQueuedAction, IFmWatchItem, IFmLocalChange } from ".";
import { User } from "@firebase/auth-types";
import { IFmLocalEvent } from "firemodel";
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
  config?: IFirebaseClientConfig;
  /** a list of custom claims that this user has */
  claims?: string[];
  /** the authentication status of the user */
  authenticated: false | "anonymous" | "logged-in";
  currentUser?: IFiremodelAbbreviatedUser;
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
  watching: IFmWatchItem[];
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
