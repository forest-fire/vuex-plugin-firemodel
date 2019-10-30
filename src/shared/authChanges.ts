import { IFmAuthEventContext, FmConfigMutation } from "../types/index";
import { User } from "@firebase/auth-types";
import { database } from "./database";
import { runQueue } from "./runQueue";

export const authChanged = <T>(
  context: Partial<IFmAuthEventContext<T>>
) => async (user: User | null) => {
  const ctx = {
    ...context,
    isAnonymous: user ? user.isAnonymous : false,
    uid: user ? user.uid : "",
    emailVerified: user ? user.emailVerified : false,
    email: user ? user.email : ""
  } as IFmAuthEventContext<T>;

  if (user) {
    console.info(
      `Login detected [uid: ${user.uid}, anonymous: ${user.isAnonymous}]`
    );
    ctx.commit(FmConfigMutation.userLoggedIn, user);
    await runQueue(ctx, "logged-in");
  } else {
    console.info(`Logout detected`, user);
    ctx.commit(FmConfigMutation.userLoggedOut, user);
    await runQueue(ctx, "logged-out");
    if (ctx.config.anonymousAuth) {
      const auth = await (await database()).auth();
      const anon = await auth.signInAnonymously();
      const user = {
        uid: (anon.user as User).uid,
        isAnonymous: true,
        emailVerified: false
      };
      ctx.commit(FmConfigMutation.userLoggedIn, user);
    }
  }
};
