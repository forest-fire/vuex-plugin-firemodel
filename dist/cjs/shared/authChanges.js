"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const runQueue_1 = require("./runQueue");
let _uid;
let _isAnonymous;
exports.authChanged = (context) => async (user) => {
    if (user) {
        console.group("Login Event");
        console.info(`Login detected [uid: ${user.uid}, anonymous: ${user.isAnonymous}]`);
        if (!user.isAnonymous && _isAnonymous === true) {
            console.log(`anonymous user ${_uid} was abandoned in favor of user ${user.uid}`);
            context.commit("USER_ABANDONED" /* userAbandoned */, {
                user: context.auth.currentUser,
                priorUid: _uid
            });
            await runQueue_1.runQueue(context, "user-abandoned");
        }
        context.commit("USER_LOGGED_IN" /* userLoggedIn */, context.auth.currentUser);
        const token = await user.getIdTokenResult();
        context.commit("SET_CUSTOM_CLAIMS", token.claims);
        context.commit("SET_AUTH_TOKEN", token.token);
        _uid = user.uid;
        _isAnonymous = user.isAnonymous;
        await runQueue_1.runQueue(context, "logged-in");
        console.groupEnd();
    }
    else {
        console.group("Logout Event");
        console.info(`User`, user);
        context.commit("USER_LOGGED_OUT" /* userLoggedOut */);
        await runQueue_1.runQueue(context, "logged-out");
        console.groupEnd();
    }
};
//# sourceMappingURL=authChanges.js.map