import { ActionTree } from "vuex";

import { IFiremodelState, ISignOutPayload } from "../../index";
import { database } from "../../shared/database";
import { FireModelPluginError } from "../../errors/FiremodelPluginError";
import { ActionCodeSettings } from "@firebase/auth-types";
import { FmEvents, Record } from "firemodel";

/**
 * **authActions**
 *
 * The Firebase AUTH actions which this plugin will execute for the user
 */
export const authActions = <T>() =>
  ({
    /**
     * Sends a email and password trying to auth on firebase module `signInWithEmailAndPassword`.
     * For more see [API docs](https://firebase.google.com/docs/reference/node/firebase.auth.Auth.html#signinwithemailandpassword).
     */
    async signInWithEmailAndPassword(
      { commit },
      { email, password }: { email: string; password: string }
    ) {
      try {
        const db = await database();
        const auth = await db.auth();
        const userCredential = await auth.signInWithEmailAndPassword(
          email,
          password
        );
        commit("signInWithEmailAndPassword", userCredential);
        if (userCredential.user) {
          const token = await userCredential.user.getIdTokenResult();
          commit("SET_CUSTOM_CLAIMS", token.claims);
        }

        return userCredential;
      } catch (e) {
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
    async createUserWithEmailAndPassword(
      { commit },
      { email, password }: { email: string; password: string }
    ) {
      try {
        const db = await database();
        const auth = await db.auth();
        const userCredential = await auth.createUserWithEmailAndPassword(
          email,
          password
        );
        commit("createUserWithEmailAndPassword", userCredential);

        return userCredential;
      } catch (e) {
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
    async sendPasswordResetEmail(
      { commit },
      {
        email,
        actionCodeSettings
      }: { email: string; actionCodeSettings?: ActionCodeSettings | null }
    ) {
      try {
        const db = await database();
        const auth = await db.auth();
        await auth.sendPasswordResetEmail(email, actionCodeSettings);
        commit("sendPasswordResetEmail");
      } catch (e) {
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
    async confirmPasswordReset(
      { commit },
      { code, newPassword }: { code: string; newPassword: string }
    ) {
      try {
        const db = await database();
        const auth = await db.auth();
        await auth.confirmPasswordReset(code, newPassword);
        commit("confirmPasswordReset");
      } catch (e) {
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
    async verifyPasswordResetCode({ commit }, code: string) {
      try {
        const db = await database();
        const auth = await db.auth();
        const email = await auth.verifyPasswordResetCode(code);
        commit("verifyPasswordResetCode", email);

        return email;
      } catch (e) {
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
    async updateEmail({ commit, state }, newEmail: string) {
      if (!state.currentUser) {
        commit(
          "error",
          `The updateEmail dispatch was dispatched but the current user profile is empty!`
        );
        throw new FireModelPluginError(
          `The updateEmail dispatch was dispatched but the current user profile is empty!`,
          "not-ready"
        );
      }

      try {
        const user = state.currentUser;
        await user.fullProfile.updateEmail(newEmail);
        commit("updateEmail", { uid: user.uid, email: newEmail });
      } catch (e) {
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
    async updatePassword({ commit, state }, newPassword: string) {
      if (!state.currentUser) {
        commit(
          "error",
          `The updatePassword dispatch was dispatched but the current user profile is empty!`
        );
        throw new FireModelPluginError(
          `The updateEmail dispatch was dispatched but the current user profile is empty!`,
          "not-ready"
        );
      }

      try {
        const user = state.currentUser;
        await user.fullProfile.updatePassword(newPassword);
        commit("updateEmail", { uid: user.uid, email: newPassword });
      } catch (e) {
        commit("error", {
          stack: e.stack,
          message: `Failure to update the logged in user's email address: ${e.message} [ ${e.code} ${e.name} ]`
        });
        throw e;
      }
    },

    /**
     * Signs out the current user from Firebase; it will also
     * optionally send a **reset** to the `Model` which stores the
     * user profile of the user.
     */
    async signOut({ commit }, { uid, email, model }: ISignOutPayload) {
      try {
        const db = await database();
        Record.defaultDb = db;
        const auth = await db.auth();
        if (model) {
          const localPath =
            typeof model === "string" ? model : Record.create(model).localPath;
          commit(`${localPath}/RESET`, { uid, email, model });
        }
        await auth.signOut();
        commit("@firemodel/SIGNED_OUT", { uid, email, model });
      } catch (e) {
        commit("error", {
          stack: e.stack,
          message: `Failure to sign out of Firebase: ${e.message}`
        });
        throw e;
      }
    }
  } as ActionTree<IFiremodelState<T>, T>);
