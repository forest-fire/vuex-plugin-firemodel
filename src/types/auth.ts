import { Model } from "firemodel";

export enum AuthPersistenceStrategy {
  /**
   * Indicates that the state will be persisted even when the browser window is closed
   * or the activity is destroyed in React Native. An explicit sign out is needed to
   * clear that state. Note that Firebase Auth web sessions are single host origin
   * and will be persisted for a single domain only.
   */
  local = "local",
  /**
   * Indicates that the state will only persist in the current session or tab, and will
   * be cleared when the tab or window in which the user authenticated is closed. Applies
   * only to web apps.
   */
  session = "session",
  /**
   * Indicates that the state will only be stored in memory and will be cleared when the
   * window or activity is refreshed.
   */
  none = "none"
}

export type IAuthPersistenceStrategy = keyof typeof AuthPersistenceStrategy;

/**
 * The payload of a `@firemodel/SIGNED_OUT` action and downstream mutations to both
 * `@firemodel` and other stateful modules. The mutations include both _reset_ messages
 * as well as the `[module]/SIGNED_OUT` mutations
 */
export interface ISignOutPayload<T extends Model = Model> {
  /** the `uid` of the user who is being signed out */
  uid: string;
  email?: string;
  /**
   * An identifier of the **Firemodel** `Model` which stores the user profile. This can either
   * but the _constructor_ for the model or you can simply pass in a string "dot" path to the
   * local path in the Vuex state tree.
   */
  model?: (new () => T) | string;
}

export interface IAuthProfile {
  displayName?: string;
  photoURL?: string;
}

export interface ICurrentUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  emailVerified: boolean;
  isAnonymous: boolean;
  isLoggedIn: boolean;
  phoneNumber: string | null;
  photoUrl: string | null;
  refreshToken: string;
  lastSignIn?: string;
  createdAt?: string;
}
