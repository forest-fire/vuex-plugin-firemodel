import type { IClientAuth, IMockAuth } from "@forest-fire/types";
export declare function getAuth(): IMockAuth | import("@firebase/auth-types").FirebaseAuth;
export declare function setAuth(auth: IClientAuth): void;
