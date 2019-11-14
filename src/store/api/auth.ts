/**
 * These functions are really just wrappers around the available actions
 * which Firemodel provides but are type-safe and often are a more easily
 * used means to achieve **Firebase** _auth_ functions
 */

import { getStore } from "../../index";
import { ActionCodeSettings } from "@firebase/auth-types";

/**
 * Log into the Firebase AUTH sytem using email/password. If successful it returns
 * a Firebase "user credential".
 */
export async function signInWithEmailAndPassword(
  email: string,
  password: string
) {
  return getStore().dispatch({
    type: "@firemodel/signInWithEmailAndPassword",
    email,
    password
  });
}

export async function signOut() {
  return getStore().dispatch({
    type: "@firemodel/signOut"
  });
}

export async function sendPasswordResetEmail(
  email: string,
  actionCodeSettings?: ActionCodeSettings
) {
  return getStore().dispatch({
    type: "@firemodel/sendPasswordResetEmail",
    email
  });
}
