"use strict";
/**
 * These functions are really just wrappers around the available actions
 * which Firemodel provides but are type-safe and often are a more easily
 * used means to achieve **Firebase** _auth_ functions
 */
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../index");
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
async function signOut() {
    return index_1.getStore().dispatch({
        type: "@firemodel/signOut"
    });
}
exports.signOut = signOut;
async function sendPasswordResetEmail(email, actionCodeSettings) {
    return index_1.getStore().dispatch({
        type: "@firemodel/sendPasswordResetEmail",
        email
    });
}
exports.sendPasswordResetEmail = sendPasswordResetEmail;
//# sourceMappingURL=auth.js.map