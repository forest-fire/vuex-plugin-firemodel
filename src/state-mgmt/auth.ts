import type { IClientAuth, IMockAuth } from "@forest-fire/types";
import { getDatabase } from "./database";

let _auth: IClientAuth | IMockAuth

export async function getAuth() {
  if(!_auth) {
    _auth = await getDatabase().auth() as IClientAuth | IMockAuth
  }

  return _auth;
}

export function setAuth(auth: IClientAuth) {
  _auth = auth
}