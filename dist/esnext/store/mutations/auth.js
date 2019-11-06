import Vue from "vue";
/**
 * The **mutations** associated to the Firebase Auth API.
 */
export const authMutations = () => ({
    signInWithEmailAndPassword(state, userCredential) {
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
    createUserWithEmailAndPassword(state, userCredential) {
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
    updateEmail(state, email) {
        Vue.set(state, "currentUser", Object.assign(Object.assign({}, state.currentUser), { email }));
    },
    updatePassword() {
        // nothing to do
    },
    signOut(state) {
        // no need to change state tree as the observer on onAuthChanged will address this
    },
    /** once the sign out process has completed */
    SIGNED_OUT(state, payload) {
        console.log(`Signed out:`, payload);
    }
});
