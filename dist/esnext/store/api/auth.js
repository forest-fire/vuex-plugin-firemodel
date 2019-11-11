import { getStore } from "../../index";
/**
 * Log into the Firebase AUTH sytem using email/password. If successful it returns
 * a Firebase "user credential".
 */
export async function signInWithEmailAndPassword(email, password) {
    return getStore().dispatch({
        type: "@firemodel/signInWithEmailAndPassword",
        email,
        password
    });
}
export async function signOut() {
    return getStore().dispatch({
        type: "@firemodel/signOut"
    });
}
