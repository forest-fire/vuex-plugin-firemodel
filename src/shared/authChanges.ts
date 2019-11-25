import {
  IFmAuthEventContext,
  FmConfigMutation,
  IAuthChangeContext
} from "../types/index";
import { User, UserCredential } from "@firebase/auth-types";
import { database } from "./database";
import { runQueue } from "./runQueue";

let _uid: string;
let _isAnonymous: boolean;

export const authChanged = <T>(context: IAuthChangeContext<T>) => async (
  user: User | null
) => {
  if (user && (user as any).credential) {
    // TODO: look into why this is happening
    const e = new Error();
    console.warn(
      "Auth changed but it appears to have given us a UserCredential rather than a User object!",
      e.stack
    );
    user = (user as any).user as User;
  }
  // const ctx = () =>
  // ({
  //   ...context
  // } as IFmAuthEventContext<T>);

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
        user,
        priorUid: _uid
      });

      await runQueue(context, "user-abandoned");
    }

    context.commit(FmConfigMutation.userLoggedIn, user);

    const token = await user.getIdTokenResult();
    context.commit("SET_CUSTOM_CLAIMS", token.claims);
    context.commit("SET_AUTH_TOKEN", token.token);

    _uid = user.uid;
    _isAnonymous = user.isAnonymous;
    await runQueue(context, "logged-in");
    console.groupEnd();
  } else {
    console.group("Logout Event");
    console.info(`User`, user);
    context.commit(FmConfigMutation.userLoggedOut, user);
    await runQueue(context, "logged-out");
    // if (ctx().config.anonymousAuth) {
    //   // const auth = await (await database()).auth();
    //   // const anon = await auth.signInAnonymously();

    //   ctx().commit(FmConfigMutation.userLoggedOut, {});
    // }
    console.groupEnd();
  }
};
