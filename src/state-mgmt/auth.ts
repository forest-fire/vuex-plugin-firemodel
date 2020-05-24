import type { IClientAuth, IMockAuth } from "@forest-fire/types";

let _auth: IClientAuth | IMockAuth

export function getAuth() {
  return _auth;
}

export function setAuth(auth: IClientAuth) {
  _auth = auth
}