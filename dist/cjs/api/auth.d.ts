/**
 * These functions are really just wrappers around the available actions
 * which Firemodel provides but are type-safe and often are a more easily
 * used means to achieve **Firebase** _auth_ functions
 */
import { ActionCodeSettings, UserCredential } from "@firebase/auth-types";
import { IAuthProfile } from "../types";
import { IModelConstructor } from "firemodel";
/**
 * Log into the Firebase AUTH sytem using email/password. If successful it returns
 * a Firebase "user credential".
 */
export declare function signInWithEmailAndPassword(email: string, password: string): Promise<UserCredential>;
/**
 * Allows a frontend app to create a new user for email and password
 * authentication. The account will initially be set to _un-verified_ but
 * the email used will be sent a link to make the account verified.
 */
export declare function createUserWithEmailAndPassword(email: string, password: string): Promise<UserCredential>;
/**
 * Signs out the current user from Firebase; it will also
 * optionally send a **reset** to the `Model` which stores the
 * user profile of the user.
 */
export declare function signOut(payload: {
    uid?: string;
    email?: string;
    /** model constructor or db path */
    model?: IModelConstructor | string;
}): Promise<any>;
/**
 * Sends a password reset email to the given email address.
 * To complete the password reset, dispatch `confirmPasswordReset` with
 * the code supplied in the email sent to the user, along with the new password
 * specified by the user.
 */
export declare function sendPasswordResetEmail(email: string, actionCodeSettings?: ActionCodeSettings): Promise<void>;
/**
 * Completes the password reset process, given a _confirmation code_
 * and new _password_.
 */
export declare function confirmPasswordReset(code: string, newPassword: string): Promise<void>;
/**
 * Checks a password reset code sent to the user by email or other
 * out-of-band mechanism. Returns the user's email address if valid.
 */
export declare function verifyPasswordResetCode(code: string): Promise<string>;
/**
 * Updates the user's email address. An email will be sent to the original email address
 * that allows owner of that email address to revoke the email address change.
 */
export declare function updateEmail(newEmail: string): Promise<void>;
/**
 * Updates the user's password. In order to allow this operation a user
 * must have logged in recently. If this requirement isn't met a
 * `auth/requires-recent-login` error will be thrown. You will then have to
 * call the `reauthenticateWithCredential` to resolve this.
 */
export declare function updatePassword(password: string): Promise<void>;
/**
 * Update a user's basic profile information with name and/or
 * photo URL.
 */
export declare function updateProfile(profile: IAuthProfile): Promise<any>;
/**
 * Sends a verification email to the currently logged in user
 */
export declare function sendEmailVerification(): Promise<void>;
