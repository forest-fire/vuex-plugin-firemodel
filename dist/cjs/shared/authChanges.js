"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
const runQueue_1 = require("./runQueue");
exports.authChanged = (context) => async (user) => {
    const ctx = Object.assign(Object.assign({}, context), { isAnonymous: user ? user.isAnonymous : false, uid: user ? user.uid : "", emailVerified: user ? user.emailVerified : false, email: user ? user.email : "" });
    if (user) {
        console.info(`Login detected [uid: ${user.uid}, anonymous: ${user.isAnonymous}]`);
        ctx.commit("USER_LOGGED_IN" /* userLoggedIn */, user);
        await runQueue_1.runQueue(ctx, "logged-in");
    }
    else {
        console.info(`Logout detected`, user);
        ctx.commit("USER_LOGGED_OUT" /* userLoggedOut */, user);
        await runQueue_1.runQueue(ctx, "logged-out");
        if (ctx.config.anonymousAuth) {
            const auth = await (await database_1.database()).auth();
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
//# sourceMappingURL=authChanges.js.map