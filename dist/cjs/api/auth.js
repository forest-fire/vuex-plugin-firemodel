"use strict";
/**
 * These functions are really just wrappers around the available actions
 * which Firemodel provides but are type-safe and often are a more easily
 * used means to achieve **Firebase** _auth_ functions
 */
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const FiremodelPluginError_1 = require("../errors/FiremodelPluginError");
/**
 * Log into the Firebase AUTH sytem using email/password. If successful it returns
 * a Firebase "user credential".
 */
async function signInWithEmailAndPassword(email, password) {
    return index_1.getStore().dispatch({
        type: "@firemodel/signInWithEmailAndPassword",
        email,
        password
    });
}
exports.signInWithEmailAndPassword = signInWithEmailAndPassword;
/**
 * Allows a frontend app to create a new user for email and password
 * authentication. The account will initially be set to _un-verified_ but
 * the email used will be sent a link to make the account verified.
 */
async function createUserWithEmailAndPassword(email, password) {
    return index_1.getStore().dispatch({
        type: "@firemodel/createUserWithEmailAndPassword",
        email,
        password
    });
}
exports.createUserWithEmailAndPassword = createUserWithEmailAndPassword;
/**
 * Signs out the current user from Firebase; it will also
 * optionally send a **reset** to the `Model` which stores the
 * user profile of the user.
 */
async function signOut(payload) {
    return index_1.getStore().dispatch({
        type: "@firemodel/signOut",
        payload
    });
}
exports.signOut = signOut;
async function getIdToken(forceRefresh) {
    var _a;
    const fmState = this.getStore().state["@firemodel"];
    if (fmState.token && forceRefresh !== true) {
        return fmState.token;
    }
    const auth = await index_1.getAuth();
    const tokenPromise = (_a = auth.currentUser) === null || _a === void 0 ? void 0 : _a.getIdTokenResult(forceRefresh);
    if (tokenPromise) {
        const token = await tokenPromise;
        return token;
    }
    throw new FiremodelPluginError_1.FireModelPluginError(`Call to getIdToken() returned nothing! ${auth.currentUser
        ? ""
        : 'This was because -- for some reason -- the "userProfile" was not set!'}`, "firemodel-plugin/not-allowed");
}
exports.getIdToken = getIdToken;
/**
 * Sends a password reset email to the given email address.
 * To complete the password reset, dispatch `confirmPasswordReset` with
 * the code supplied in the email sent to the user, along with the new password
 * specified by the user.
 */
async function sendPasswordResetEmail(email, actionCodeSettings) {
    return index_1.getStore().dispatch({
        type: "@firemodel/sendPasswordResetEmail",
        email,
        actionCodeSettings
    });
}
exports.sendPasswordResetEmail = sendPasswordResetEmail;
/**
 * Completes the password reset process, given a _confirmation code_
 * and new _password_.
 */
async function confirmPasswordReset(code, newPassword) {
    return index_1.getStore().dispatch({
        type: "@firemodel/confirmPassordReset",
        code,
        newPassword
    });
}
exports.confirmPasswordReset = confirmPasswordReset;
/**
 * Checks a password reset code sent to the user by email or other
 * out-of-band mechanism. Returns the user's email address if valid.
 */
async function verifyPasswordResetCode(code) {
    return index_1.getStore().dispatch({
        type: "@firemodel/verifyPasswordResetCode",
        code
    });
}
exports.verifyPasswordResetCode = verifyPasswordResetCode;
/**
 * Updates the user's email address. An email will be sent to the original email address
 * that allows owner of that email address to revoke the email address change.
 */
async function updateEmail(newEmail) {
    return index_1.getStore().dispatch({
        type: "@firemodel/updateEmail",
        payload: newEmail
    });
}
exports.updateEmail = updateEmail;
/**
 * Updates the user's password. In order to allow this operation a user
 * must have logged in recently. If this requirement isn't met a
 * `auth/requires-recent-login` error will be thrown. You will then have to
 * call the `reauthenticateWithCredential` to resolve this.
 */
async function updatePassword(password) {
    return index_1.getStore().dispatch({
        type: "@firemodel/updatePassword",
        password
    });
}
exports.updatePassword = updatePassword;
/**
 * Update a user's basic profile information with name and/or
 * photo URL.
 */
async function updateProfile(profile) {
    return index_1.getStore().dispatch({
        type: "@firemodel/updateProfile",
        profile
    });
}
exports.updateProfile = updateProfile;
/**
 * Sends a verification email to the currently logged in user
 */
async function sendEmailVerification() {
    return index_1.getStore().dispatch({
        type: "@firemodel/sendEmailVerification"
    });
}
exports.sendEmailVerification = sendEmailVerification;
async function reauthenticateWithCredential(credential) {
    return index_1.getStore().dispatch({
        type: "@firemodel/authenticateWithCredential",
        credential
    });
}
exports.reauthenticateWithCredential = reauthenticateWithCredential;
async function linkWithCredential(credential) {
    return index_1.getStore().dispatch({
        type: "@firemodel/linkWithCredential",
        credential
    });
}
exports.linkWithCredential = linkWithCredential;
//# sourceMappingURL=auth.js.map