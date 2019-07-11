import { MutationTree } from "vuex";

import { IFiremodelState } from "../..";
import { UserCredential } from "@firebase/auth-types";
import { IFiremodelAbbreviatedUser } from "../../types";

/**
 * The **mutations** associated to the Firebase Auth API.
 */
export const authMutations: MutationTree<IFiremodelState> = {
  signInWithEmailAndPassword(state, userCredential: UserCredential) {
    if (userCredential.user) {
      state.currentUser = {
        email: userCredential.user.email,
        emailVerified: userCredential.user.emailVerified,
        uid: userCredential.user.uid,
        isAnonymous: userCredential.user.isAnonymous,
        fullProfile: userCredential.user
      };
    }
  },
  createUserWithEmailAndPassword(state, userCredential: UserCredential) {
    // no need to change state tree as the observer on onAuthChanged will address this
  },

  sendPasswordResetEmail(state) {
    // nothing to do
  },

  confirmPasswordReset(state) {
    // nothing to do
  },

  verifyPasswordResetCode(state, email) {
    // on success it returns the email of the user who entered the reset code
  },

  updateEmail(state, email: string) {
    state.currentUser = {
      ...(state.currentUser as IFiremodelAbbreviatedUser),
      ...{ email }
    };
  },

  updatePassword() {
    // nothing to do
  },

  signOut() {
    // no need to change state tree as the observer on onAuthChanged will address this
  }
};
