import { runQueue } from "./runQueue";
import { configuration } from "..";
let _uid;
let _isAnonymous;
export const authChanged = (context) => async (user) => {
    if (user) {
        if (!user.isAnonymous && _isAnonymous === true) {
            console.group('Starting "user-abandoned" event');
            console.log(`anonymous user ${_uid} was abandoned in favor of user ${user.uid}`);
            context.commit("USER_ABANDONED" /* userAbandoned */, {
                user: user,
                priorUid: _uid
            });
            await runQueue(context, "user-abandoned");
            console.groupEnd();
        }
        console.group("Login Event");
        console.info(`Login detected [uid: ${user.uid}, anonymous: ${user.isAnonymous}]`);
        context.commit("USER_LOGGED_IN" /* userLoggedIn */, extractUserInfo(user));
        console.log("Getting auth token");
        const token = await user.getIdTokenResult();
        context.commit("SET_AUTH_TOKEN", token);
        _uid = user.uid;
        _isAnonymous = user.isAnonymous;
        await runQueue(Object.assign(Object.assign({}, context), { isLoggedIn: true, isAnonymous: user.isAnonymous, uid: user.uid, email: user.email, emailVerified: user.emailVerified }), "logged-in");
        console.groupEnd();
    }
    else {
        console.group("Logout event");
        context.commit("USER_LOGGED_OUT" /* userLoggedOut */, extractUserInfo(user));
        await runQueue(Object.assign(Object.assign({}, context), { isLoggedIn: false, isAnonymous: false, emailVerified: false }), "logged-out");
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
function extractUserInfo(input) {
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
