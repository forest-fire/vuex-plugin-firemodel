import { IFirebaseClientConfig } from "abstracted-client";
import { RealTimeDB } from "abstracted-firebase";
/**
 * connects to a Firebase DB unless already connected in which case it
 * it just hands back the existing connection.
 */
export declare function database(config?: IFirebaseClientConfig): Promise<RealTimeDB<import("@firebase/auth-types").FirebaseAuth>>;
