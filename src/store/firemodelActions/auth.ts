import { ActionTree } from "vuex";

import { IFiremodelState, IGenericStateTree } from "../..";
import { database } from "../../shared/database";

/**
 * **authActions**
 *
 * The Firebase AUTH actions which this plugin will execute for the user
 */
export const authActions: ActionTree<IFiremodelState, IGenericStateTree> = {
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
      commit("@firebase/createUserWithEmailAndPassword", userCredential);

      return userCredential;
    } catch (e) {
      commit("@firebase/error", {
        stack: e.stack,
        message: `Failure to create user: ${e.message} [ ${e.code} ${e.name} ]`
      });
      throw e;
    }
  },

  /**
   * When resetting a password the user receives a **code** by an off-channel means
   * (typically email); this dispatch message allows confirmation of the reset using
   * this code.
   */
  async verifyPasswordResetCode({ commit }, code: string) {
    try {
      const db = await database();
      const auth = await db.auth();
      const email = await auth.verifyPasswordResetCode(code);
      commit("@firemodel/verifyPasswordResetCode", email);

      return email;
    } catch (e) {
      commit("@firebase/error", {
        stack: e.stack,
        message: `Failure to verify password reset code: ${e.message} [ ${
          e.code
        } ${e.name} ]`
      });
      throw e;
    }
  },

  /**
   * Updates the user's email address. An email will be sent to the original email address
   * that allows owner of that email address to revoke the email address change.
   */
  async updateEmail({ commit, state }, newEmail: string) {
    try {
      const user = state.currentUser;
      await user.updateEmail(newEmail);
      commit("@firemodel/updateEmail", { uid: user.uid, email: newEmail });
    } catch (e) {
      commit("@firebase/error", {
        stack: e.stack,
        message: `Failure to update the logged in user's email address: ${
          e.message
        } [ ${e.code} ${e.name} ]`
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
    try {
      const user = state.currentUser;
      await user.updatePassword(newPassword);
      commit("@firemodel/updateEmail", { uid: user.uid, email: newPassword });
    } catch (e) {
      commit("@firebase/error", {
        stack: e.stack,
        message: `Failure to update the logged in user's email address: ${
          e.message
        } [ ${e.code} ${e.name} ]`
      });
      throw e;
    }
  },

  /**
   * Signs out the current user from Firebase
   */
  async signOut({ commit }) {
    try {
      const db = await database();
      const auth = await db.auth();
      const email = await auth.signOut();
      commit("@firemodel/signOut", email);
    } catch (e) {
      commit("@firebase/error", {
        stack: e.stack,
        message: `Failure to sign out of Firebase: ${e.message}`
      });
      throw e;
    }
  }
};
