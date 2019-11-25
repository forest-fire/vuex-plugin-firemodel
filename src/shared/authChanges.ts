import {
  FmConfigMutation,
  IFmAuthenticatatedContext,
  ICurrentUser
} from "../types/index";
import { User, UserCredential } from "@firebase/auth-types";
import { database } from "./database";
import { runQueue } from "./runQueue";
import { configuration } from "..";

let _uid: string;
let _isAnonymous: boolean;

export const authChanged = <T>(context: IFmAuthenticatatedContext<T>) => async (
  user: User | null
) => {
  if (context.auth.currentUser) {
    console.group("Login Event");

    console.info(
      `Login detected [uid: ${context.auth.currentUser.uid}, anonymous: ${context.auth.currentUser.isAnonymous}]`
    );
    if (!context.auth.currentUser.isAnonymous && _isAnonymous === true) {
      console.log(
        `anonymous user ${_uid} was abandoned in favor of user ${context.auth.currentUser.uid}`
      );
      context.commit(FmConfigMutation.userAbandoned, {
        user: context.auth.currentUser,
        priorUid: _uid
      });

      await runQueue(context, "user-abandoned");
    }

    context.commit(
      FmConfigMutation.userLoggedIn,
      extractUserInfo(context.auth.currentUser)
    );

    if (context.auth.currentUser) {
      console.log("Getting custom claims and token");
      const token = await context.auth.currentUser.getIdTokenResult();
      context.commit("SET_CUSTOM_CLAIMS", token.claims);
      context.commit("SET_AUTH_TOKEN", token.token);
    } else {
      console.warn("The currentUser property was not present on auth!");
    }

    _uid = context.auth.currentUser.uid;
    _isAnonymous = context.auth.currentUser.isAnonymous;
    await runQueue(context, "logged-in");
    console.groupEnd();
  } else {
    console.group("Logout event");
    context.commit(FmConfigMutation.userLoggedOut, extractUserInfo(user));
    await runQueue(context, "logged-out");
    console.log("finished onLogout queue");

    if (configuration.anonymousAuth) {
      console.info("logging in as a anonymous user (momentarily)");
      // async but we don't need to wait for it
      context.auth.signInAnonymously();
    }

    console.groupEnd();
  }
};

/**
 * Extracts the odd shaped object we're getting back in place of a true
 * `User` object with something useful for putting into the @firemodel
 * Vuex module.
 */
function extractUserInfo(input: User | null): ICurrentUser {
  return input
    ? {
        uid: input.uid,
        isAnonymous: input.isAnonymous,
        isLoggedIn: true,
        displayName: input.displayName,
        email: input.email,
        emailVerified: input.emailVerified,
        phoneNumber: input.phoneNumber,
        photoUrl: input.photoURL,
        refreshToken: input.refreshToken,
        lastSignIn: input.metadata.lastSignInTime,
        createdAt: input.metadata.creationTime
      }
    : {
        uid: "",
        isAnonymous: false,
        isLoggedIn: false,
        displayName: null,
        email: null,
        emailVerified: false,
        phoneNumber: null,
        photoUrl: null,
        refreshToken: ""
      };
}
