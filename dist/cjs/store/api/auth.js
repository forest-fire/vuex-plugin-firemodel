"use strict";
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
//# sourceMappingURL=auth.js.map