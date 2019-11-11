/**
 * Log into the Firebase AUTH sytem using email/password. If successful it returns
 * a Firebase "user credential".
 */
export declare function signInWithEmailAndPassword(email: string, password: string): Promise<any>;
export declare function signOut(): Promise<any>;
