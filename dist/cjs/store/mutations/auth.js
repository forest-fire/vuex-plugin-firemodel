"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMutations = void 0;
const vue_1 = __importDefault(require("vue"));
/**
 * The **mutations** associated to the Firebase Auth API.
 */
exports.authMutations = () => ({
    signInWithEmailAndPassword(state, userCredential) {
        console.debug("user signed in with email/password");
        vue_1.default.set(state, "userCredential", userCredential.credential);
        // the @firemodel.currentUser will be updated by the `changeAuth` function
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
    updatedEmail(state, email) {
        vue_1.default.set(state, "currentUser", Object.assign(Object.assign({}, state.currentUser), { email }));
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
    SET_CUSTOM_CLAIMS(state, claims) {
        vue_1.default.set(state, "claims", claims);
    },
    SET_AUTH_TOKEN(state, token) {
        vue_1.default.set(state, "token", token);
    },
    ANONYMOUS_LOGIN(state, payload) {
        // no-op
    }
});
//# sourceMappingURL=auth.js.map