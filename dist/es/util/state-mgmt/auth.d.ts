import type { IClientAuth } from "universal-fire";
import type { IMockAuth } from 'firemock';
export declare function getAuth(): Promise<import("@firebase/auth-types").FirebaseAuth | IMockAuth>;
export declare function setAuth(auth: IClientAuth): void;
