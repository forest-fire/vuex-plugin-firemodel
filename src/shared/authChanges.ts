import { IFmAuthEventContext, FmConfigMutation } from "../types/index";
import { User } from "@firebase/auth-types";
import { database } from "./database";
import { runQueue } from "./runQueue";

let _uid: string;
let _isAnonymous: boolean;

export const authChanged = <T>(
  context: Partial<IFmAuthEventContext<T>>
) => async (user: User | null) => {
  const ctx = () =>
    ({
      ...context,
      isAnonymous: user ? user.isAnonymous : false,
      uid: user ? user.uid : "",
      emailVerified: user ? user.emailVerified : false,
      email: user ? user.email : "",
      fullProfile: user
    } as IFmAuthEventContext<T>);

  if (user) {
    console.group("Login Event");
    console.info(
      `Login detected [uid: ${user.uid}, anonymous: ${user.isAnonymous}]`
    );

    if (user) {
      if (!user.isAnonymous && _isAnonymous === true) {
        console.log(
          `anonymous user ${_uid} was abandoned in favor of user ${user.uid}`
        );
        ctx().commit(FmConfigMutation.userAbandoned, { user, priorUid: _uid });
        await runQueue(ctx(), "user-upgraded");
      }

      ctx().commit(FmConfigMutation.userLoggedIn, user);
    } else {
      ctx().commit(FmConfigMutation.userLoggedOut, user);
    }

    const token = await user.getIdTokenResult();
    ctx().commit("SET_CUSTOM_CLAIMS", token.claims);
    ctx().commit("SET_AUTH_TOKEN", token.token);

    _uid = user.uid;
    _isAnonymous = user.isAnonymous;
    await runQueue(ctx(), "logged-in");
    console.groupEnd();
  } else {
    console.group("Logout Event");
    console.info(`User`, user);
    ctx().commit(FmConfigMutation.userLoggedOut, user);
    await runQueue(ctx(), "logged-out");
    if (ctx().config.anonymousAuth) {
      const auth = await (await database()).auth();
      const anon = await auth.signInAnonymously();
      const user = {
        uid: (anon.user as User).uid,
        isAnonymous: true,
        emailVerified: false
      };
      ctx().commit(FmConfigMutation.userLoggedIn, user);
    }
    console.groupEnd();
  }
};
