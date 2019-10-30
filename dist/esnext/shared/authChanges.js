import { database } from "./database";
import { runQueue } from "./runQueue";
export const authChanged = (context) => async (user) => {
    const ctx = Object.assign(Object.assign({}, context), { isAnonymous: user ? user.isAnonymous : false, uid: user ? user.uid : "", emailVerified: user ? user.emailVerified : false, email: user ? user.email : "" });
    if (user) {
        console.info(`Login detected [uid: ${user.uid}, anonymous: ${user.isAnonymous}]`);
        ctx.commit("USER_LOGGED_IN" /* userLoggedIn */, user);
        await runQueue(ctx, "logged-in");
    }
    else {
        console.info(`Logout detected`, user);
        ctx.commit("USER_LOGGED_OUT" /* userLoggedOut */, user);
        await runQueue(ctx, "logged-out");
        if (ctx.config.anonymousAuth) {
            const auth = await (await database()).auth();
            const anon = await auth.signInAnonymously();
            const user = {
                uid: anon.user.uid,
                isAnonymous: true,
                emailVerified: false
            };
            ctx.commit("USER_LOGGED_IN" /* userLoggedIn */, user);
        }
    }
};
