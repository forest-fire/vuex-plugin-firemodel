import { database } from "../../shared/database";
import { FireModelPluginError } from "../../errors/FiremodelPluginError";
import { Record } from "firemodel";
import { FireModelProxyError } from "firemodel/dist/cjs/errors";
/**
 * **authActions**
 *
 * The Firebase AUTH actions which this plugin will execute for the user
 */
export const authActions = () => ({
    /**
     * Sends a email and password trying to auth on firebase module `signInWithEmailAndPassword`.
     * For more see [API docs](https://firebase.google.com/docs/reference/node/firebase.auth.Auth.html#signinwithemailandpassword).
     */
    async signInWithEmailAndPassword({ commit }, { email, password }) {
        try {
            const db = await database();
            const auth = await db.auth();
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            commit("signInWithEmailAndPassword", userCredential);
            return userCredential;
        }
        catch (e) {
            commit("error", {
                stack: e.stack,
                message: `Failure to login user [${email}]: ${e.message} [ ${e.code} ${e.name} ]`
            });
            throw e;
        }
    },
    /**
     * Allows a frontend app to create a new user for email and password
     * authentication. The account will initially be set to _un-verified_ but
     * the email used will be sent a link to make the account verified.
     */
    async createUserWithEmailAndPassword({ commit }, { email, password }) {
        try {
            const db = await database();
            const auth = await db.auth();
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            commit("createUserWithEmailAndPassword", userCredential);
            return userCredential;
        }
        catch (e) {
            commit("error", {
                stack: e.stack,
                message: `Failure to create user: ${e.message} [ ${e.code} ${e.name} ]`
            });
            throw e;
        }
    },
    /**
     * Sends a password reset email to the given email address.
     * To complete the password reset, dispatch `confirmPasswordReset` with
     * the code supplied in the email sent to the user, along with the new password
     * specified by the user.
     */
    async sendPasswordResetEmail({ commit }, { email, actionCodeSettings }) {
        try {
            const db = await database();
            const auth = await db.auth();
            await auth.sendPasswordResetEmail(email, actionCodeSettings);
            commit("sendPasswordResetEmail", { email, actionCodeSettings });
        }
        catch (e) {
            commit("error", {
                stack: e.stack,
                message: `Failure to send password-reset email: ${e.message} [ ${e.code} ${e.name} ]`
            });
            throw e;
        }
    },
    /**
     * Completes the password reset process, given a _confirmation code_
     * and new _password_.
     */
    async confirmPasswordReset({ commit }, { code, newPassword }) {
        try {
            const db = await database();
            const auth = await db.auth();
            await auth.confirmPasswordReset(code, newPassword);
            commit("confirmPasswordReset");
        }
        catch (e) {
            commit("error", {
                stack: e.stack,
                message: `Failured to confirm password reset: ${e.message} [ ${e.code} ${e.name} ]`
            });
            throw e;
        }
    },
    /**
     * Checks a password reset code sent to the user by email or other
     * out-of-band mechanism. Returns the user's email address if valid.
     */
    async verifyPasswordResetCode({ commit }, code) {
        try {
            const db = await database();
            const auth = await db.auth();
            const email = await auth.verifyPasswordResetCode(code);
            commit("verifyPasswordResetCode", email);
            return email;
        }
        catch (e) {
            commit("error", {
                stack: e.stack,
                message: `Failure to verify password reset code: ${e.message} [ ${e.code} ${e.name} ]`
            });
            throw e;
        }
    },
    /**
     * Updates the user's email address. An email will be sent to the original email address
     * that allows owner of that email address to revoke the email address change.
     */
    async updateEmail({ commit, state }, newEmail) {
        if (!state.currentUser) {
            commit("error", `The updateEmail dispatch was dispatched but the current user profile is empty!`);
            throw new FireModelPluginError(`The updateEmail dispatch was dispatched but the current user profile is empty!`, "not-ready");
        }
        try {
            const db = await database();
            const user = (await db.auth()).currentUser;
            await user.updateEmail(newEmail);
            commit("updatedEmail", { uid: user.uid, email: newEmail });
        }
        catch (e) {
            commit("error", {
                stack: e.stack,
                message: `Failure to update the logged in user's email address: ${e.message} [ ${e.code} ${e.name} ]`
            });
            throw e;
        }
    },
    /**
     * Updates the user's password. In order to allow this operation a user
     * must have logged in recently. If this requirement isn't met a
     * `auth/requires-recent-login` error will be thrown. You will then have to
     * call the `reauthenticateWithCredential` to resolve this.
     */
    async updatePassword({ commit, state }, { password }) {
        if (!state.currentUser) {
            commit("error", `The updatePassword dispatch was dispatched but the current user profile is empty!`);
            throw new FireModelPluginError(`The updateEmail dispatch was dispatched but the current user profile is empty!`, "not-ready");
        }
        try {
            const db = await database();
            const user = (await db.auth()).currentUser;
            await user.updatePassword(password);
            commit("updatedPassword", { uid: user.uid, password: "*****" });
        }
        catch (e) {
            commit("error", {
                stack: e.stack,
                message: `Failure to update the logged in user's password: ${e.message} [ ${e.code} ${e.name} ]`
            });
            throw e;
        }
    },
    /**
     * Update a user's basic profile information with name and/or
     * photo URL.
     */
    async updateProfile({ commit, state }, profile) {
        try {
            const db = await database();
            const auth = await db.auth();
            const user = auth.currentUser;
            if (!user) {
                throw new FireModelPluginError(`Attempt to updateProfile() before currentUser is set in Firebase identity system!`, "not-ready");
            }
            await user.updateProfile(profile);
            commit("updatedProfile", profile);
        }
        catch (e) {
            commit("error", {
                stack: e.stack,
                message: `Failure to update user's profile: ${e.message} [ ${e.code} ]`
            });
            throw e;
        }
    },
    /**
     * Signs out the current user from Firebase; it will also
     * optionally send a **reset** to the `Model` which stores the
     * user profile of the user.
     */
    async signOut({ commit }, { uid, email, model }) {
        try {
            const db = await database();
            Record.defaultDb = db;
            const auth = await db.auth();
            if (model) {
                const localPath = typeof model === "string" ? model : Record.create(model).localPath;
                commit(`${localPath}/RESET`, { uid, email, model });
            }
            await auth.signOut();
            // commit("@firemodel/SIGNED_OUT", { loggedOutUser: uid });
        }
        catch (e) {
            commit("error", {
                stack: e.stack,
                message: `Failure to sign out of Firebase: ${e.message}`
            });
            throw e;
        }
    },
    /**
     * Sends a verification email to the currently logged in user
     */
    async sendEmailVerification({ commit }) {
        try {
            const db = await database();
            const auth = await db.auth();
            if (!auth.currentUser) {
                throw new FireModelPluginError(`Attempt to call sendEmailVerification() failed because there is no "currentUser" set in the identity system yet!`, "firemodel/not-ready");
            }
            return auth.currentUser.sendEmailVerification();
        }
        catch (e) {
            commit("error", {
                stack: e.stack,
                message: `Failure to sign out of Firebase: ${e.message}`
            });
            throw e;
        }
    },
    async reauthenticateWithCredential({ commit }, credential) {
        try {
            const db = await database();
            Record.defaultDb = db;
            const auth = await db.auth();
            if (!auth.currentUser) {
                throw new FireModelPluginError(`Attempt to call reauthenticateWithCredential() requires that the "auth.currentUser" be set and it is not!`, "auth/not-allowed");
            }
            await auth.currentUser.reauthenticateWithCredential(credential);
        }
        catch (e) {
            throw new FireModelProxyError(e, "firemodelActions/auth.ts[reauthenticateWithCredential]");
        }
    },
    async linkWithCredential({ commit }, credential) {
        var _a;
        try {
            const db = await database();
            Record.defaultDb = db;
            const auth = await db.auth();
            await ((_a = auth.currentUser) === null || _a === void 0 ? void 0 : _a.linkWithCredential(credential));
        }
        catch (e) {
            throw new FireModelProxyError(e, "linkWithCredential");
        }
    }
});
