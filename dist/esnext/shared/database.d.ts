import { DB, IFirebaseClientConfig } from "abstracted-client";
/**
 * connects to a Firebase DB unless already connected in which case it
 * it just hands back the existing connection.
 */
export declare function database(config?: IFirebaseClientConfig): Promise<DB>;
