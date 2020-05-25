import { getDatabase } from "./database";
let _auth;
export async function getAuth() {
    if (!_auth) {
        _auth = await getDatabase().auth();
    }
    return _auth;
}
export function setAuth(auth) {
    _auth = auth;
}
