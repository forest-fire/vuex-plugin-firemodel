/**
 * These functions are really just wrappers around the available actions
 * which Firemodel provides but are type-safe and often are a more easily
 * used means to achieve **Firebase** _auth_ functions
 */

import {
  ActionCodeSettings,
  AuthCredential,
  IdTokenResult,
  UserCredential
} from "@firebase/auth-types";
import type { IAuthProfile, IFiremodelState } from "@/types";
import { getAuth, getStore } from "@/util";

import { FireModelPluginError } from "@/errors";
import { IModelConstructor } from "firemodel";

/**
 * Log into the Firebase AUTH sytem using email/password. If successful it returns
 * a Firebase "user credential".
 */
export async function signInWithEmailAndPassword(
  email: string,
  password: string
): Promise<UserCredential> {
  return getStore().dispatch({
    type: "@firemodel/signInWithEmailAndPassword",
    email,
    password
  });
}

/**
 * Allows a frontend app to create a new user for email and password
 * authentication. The account will initially be set to _un-verified_ but
 * the email used will be sent a link to make the account verified.
 */
export async function createUserWithEmailAndPassword(
  email: string,
  password: string
): Promise<UserCredential> {
  return getStore().dispatch({
    type: "@firemodel/createUserWithEmailAndPassword",
    email,
    password
  });
}

/**
 * Signs out the current user from Firebase; it will also
 * optionally send a **reset** to the `Model` which stores the
 * user profile of the user.
 */
export async function signOut(payload: {
  uid?: string;
  email?: string;
  /** model constructor or db path */
  model?: IModelConstructor | string;
}) {
  return getStore().dispatch({
    type: "@firemodel/signOut",
    payload
  });
}

export async function getIdToken(
  forceRefresh?: boolean
): Promise<IdTokenResult> {
  const fmState = getStore().state["@firemodel"] as IFiremodelState<unknown>;
  if (fmState.token && forceRefresh !== true) {
    return fmState.token;
  }
  const auth = await getAuth();
  const tokenPromise = auth.currentUser?.getIdTokenResult(forceRefresh);
  if (tokenPromise) {
    const token = await tokenPromise;
    return token;
  }

  throw new FireModelPluginError(
    `Call to getIdToken() returned nothing! ${
      auth.currentUser
        ? ""
        : 'This was because -- for some reason -- the "userProfile" was not set!'
    }`,
    "firemodel-plugin/not-allowed"
  );
}

/**
 * Sends a password reset email to the given email address.
 * To complete the password reset, dispatch `confirmPasswordReset` with
 * the code supplied in the email sent to the user, along with the new password
 * specified by the user.
 */
export async function sendPasswordResetEmail(
  email: string,
  actionCodeSettings?: ActionCodeSettings
): Promise<void> {
  return getStore().dispatch({
    type: "@firemodel/sendPasswordResetEmail",
    email,
    actionCodeSettings
  });
}

/**
 * Completes the password reset process, given a _confirmation code_
 * and new _password_.
 */
export async function confirmPasswordReset(
  code: string,
  newPassword: string
): Promise<void> {
  return getStore().dispatch({
    type: "@firemodel/confirmPassordReset",
    code,
    newPassword
  });
}

/**
 * Checks a password reset code sent to the user by email or other
 * out-of-band mechanism. Returns the user's email address if valid.
 */
export async function verifyPasswordResetCode(code: string): Promise<string> {
  return getStore().dispatch({
    type: "@firemodel/verifyPasswordResetCode",
    code
  });
}

/**
 * Updates the user's email address. An email will be sent to the original email address
 * that allows owner of that email address to revoke the email address change.
 */
export async function updateEmail(newEmail: string): Promise<void> {
  return getStore().dispatch({
    type: "@firemodel/updateEmail",
    newEmail
  });
}

/**
 * Updates the user's password. In order to allow this operation a user
 * must have logged in recently. If this requirement isn't met a
 * `auth/requires-recent-login` error will be thrown. You will then have to
 * call the `reauthenticateWithCredential` to resolve this.
 */
export async function updatePassword(password: string): Promise<void> {
  return getStore().dispatch({
    type: "@firemodel/updatePassword",
    password
  });
}

/**
 * Update a user's basic profile information with name and/or
 * photo URL.
 */
export async function updateProfile(profile: IAuthProfile) {
  return getStore().dispatch({
    type: "@firemodel/updateProfile",
    profile
  });
}

/**
 * Sends a verification email to the currently logged in user
 */
export async function sendEmailVerification(): Promise<void> {
  return getStore().dispatch({
    type: "@firemodel/sendEmailVerification"
  });
}

export async function reauthenticateWithCredential(
  credential: AuthCredential
): Promise<void> {
  return getStore().dispatch({
    type: "@firemodel/reauthenticateWithCredential",
    credential
  });
}

export async function linkWithCredential(credential: AuthCredential) {
  return getStore().dispatch({
    type: "@firemodel/linkWithCredential",
    credential
  });
}
