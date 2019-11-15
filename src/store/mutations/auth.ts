import { MutationTree } from "vuex";
import { IFiremodelState } from "../..";
import { UserCredential } from "@firebase/auth-types";
import { IFiremodelAbbreviatedUser } from "../../types";
import Vue from "vue";
import { IDictionary } from "firemock";

/**
 * The **mutations** associated to the Firebase Auth API.
 */
export const authMutations = <T>() =>
  ({
    signInWithEmailAndPassword(state, userCredential: UserCredential) {
      if (userCredential.user) {
        Vue.set(state, "currentUser", {
          email: userCredential.user.email,
          emailVerified: userCredential.user.emailVerified,
          uid: userCredential.user.uid,
          isAnonymous: userCredential.user.isAnonymous,
          fullProfile: userCredential.user
        });
        state.authenticated = "logged-in";
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

    updatedEmail(state, email: string) {
      Vue.set(state, "currentUser", {
        ...(state.currentUser as IFiremodelAbbreviatedUser),
        ...{ email }
      });
    },

    updatedPassword() {
      // nothing to do
    },

    signOut(state) {
      // no need to change state tree as the observer on onAuthChanged will address this
    },

    // updatedProfile(state, profile: {}) {
    //   state.currentUser?.fullProfile.displayName =
    // },

    /** once the sign out process has completed */
    SIGNED_OUT(state, payload) {
      console.log(`Signed out:`, payload);
    },

    SET_CUSTOM_CLAIMS(state, claims: IDictionary) {
      state.claims = Object.keys(claims || {});
    }
  } as MutationTree<IFiremodelState<T>>);
