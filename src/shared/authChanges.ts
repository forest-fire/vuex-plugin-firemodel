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
      email: user ? user.email : ""
    } as IFmAuthEventContext<T>);

  if (user) {
    console.info(
      `Login detected [uid: ${user.uid}, anonymous: ${user.isAnonymous}]`
    );
    if (!user.isAnonymous && _isAnonymous === true) {
      console.log(`user ${_uid} was upgraded to user ${user.uid}`);
      ctx().commit(FmConfigMutation.userUpgraded, { user, priorUid: _uid });
      await runQueue(ctx(), "user-upgraded");
    } else {
      ctx().commit(FmConfigMutation.userLoggedIn, user);
    }
    _uid = user.uid;
    _isAnonymous = user.isAnonymous;
    await runQueue(ctx(), "logged-in");
  } else {
    console.info(`Logout detected`, user);
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
  }
};
