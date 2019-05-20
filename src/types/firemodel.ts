import { IFirebaseConfig } from "abstracted-firebase";
import { IFmQueuedAction, IFmWatchItem, IFmLocalChange } from ".";

export interface IFireModelState {
  /** the configuration used to connect to the Firebase DB */
  config?: IFirebaseConfig;
  /** a list of custom claims that this user has */
  claims?: string[];
  /** the authentication status of the user */
  authenticated: false | "anonymous" | "logged-in";
  currentUser?: any;
  /** the DB connection status */
  status: "unconfigured" | "connecting" | "disconnected" | "connected" | "error";
  /**
   * callbacks which are queued to be executed when a lifecycle state is achieved
   */
  queued: IFmQueuedAction[];
  /** which DB paths are being watched */
  watching: IFmWatchItem[];
  /**
   * which records are updated locally but waiting
   * for write sync with database
   */
  localOnly: IFmLocalChange[];
  /** if there was an error the the message will be displayed here */
  errors?: string[];
}
