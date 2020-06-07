import type { IClientAuth, IMockAuth } from "@forest-fire/types";
export declare function getAuth(): Promise<import("@firebase/auth-types").FirebaseAuth | IMockAuth>;
export declare function setAuth(auth: IClientAuth): void;
