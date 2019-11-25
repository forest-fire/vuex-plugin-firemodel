import { FmConfigMutation, IFmAuthenticatatedContext } from "../types/index";
import { User, UserCredential } from "@firebase/auth-types";
import { database } from "./database";
import { runQueue } from "./runQueue";
import { configuration } from "..";

let _uid: string;
let _isAnonymous: boolean;

export const authChanged = <T>(context: IFmAuthenticatatedContext<T>) => async (
  user: User | null
) => {
  if (user) {
    console.group("Login Event");

    console.info(
      `Login detected [uid: ${user.uid}, anonymous: ${user.isAnonymous}]`
    );
    if (!user.isAnonymous && _isAnonymous === true) {
      console.log(
        `anonymous user ${_uid} was abandoned in favor of user ${user.uid}`
      );
      context.commit(FmConfigMutation.userAbandoned, {
        user: context.auth.currentUser,
        priorUid: _uid
      });

      await runQueue(context, "user-abandoned");
    }

    context.commit(FmConfigMutation.userLoggedIn, context.auth.currentUser);

    if (context.auth.currentUser) {
      console.log("Getting custom claims and token");
      const token = await context.auth.currentUser.getIdTokenResult();
      context.commit("SET_CUSTOM_CLAIMS", token.claims);
      context.commit("SET_AUTH_TOKEN", token.token);
    } else {
      console.warn("The currentUser property was not present on auth!");
    }

    _uid = user.uid;
    _isAnonymous = user.isAnonymous;
    await runQueue(context, "logged-in");
    console.groupEnd();
  } else {
    console.group("Logout event");
    context.commit(FmConfigMutation.userLoggedOut);
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
