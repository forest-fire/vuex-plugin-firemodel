/**
 * These functions are really just wrappers around the available actions
 * which Firemodel provides but are type-safe and often are a more easily
 * used means to achieve **Firebase** _auth_ functions
 */
import { ActionCodeSettings } from "@firebase/auth-types";
/**
 * Log into the Firebase AUTH sytem using email/password. If successful it returns
 * a Firebase "user credential".
 */
export declare function signInWithEmailAndPassword(email: string, password: string): Promise<any>;
export declare function signOut(): Promise<any>;
export declare function sendPasswordResetEmail(email: string, actionCodeSettings?: ActionCodeSettings): Promise<any>;
