import type { ICurrentUser, IFiremodelState } from '@/types';

import { IDictionary } from 'common-types';
import { MutationTree } from 'vuex';
import { UserCredential } from '@firebase/auth-types';
import Vue from 'vue';

/**
 * The **mutations** associated to the Firebase Auth API.
 */
export const authMutations = <T>() =>
  ({
    signInWithEmailAndPassword(state, userCredential: UserCredential) {
      console.debug('user signed in with email/password');
      Vue.set(state, 'userCredential', userCredential.credential);
      // the @firemodel.currentUser will be updated by the `changeAuth` function
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
      Vue.set(state, 'currentUser', {
        ...(state.currentUser as ICurrentUser),
        ...{ email },
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
      Vue.set(state, 'claims', claims);
    },

    SET_AUTH_TOKEN(state, token: string) {
      Vue.set(state, 'token', token);
    },

    ANONYMOUS_LOGIN(state, payload) {
      // no-op
    },
  } as MutationTree<IFiremodelState<T>>);
