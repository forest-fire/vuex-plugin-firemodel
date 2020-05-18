import { DB, IFirebaseClientConfig } from "universal-fire";
/**
 * connects to a Firebase DB unless already connected in which case it
 * it just hands back the existing connection.
 */
export declare function database(config?: IFirebaseClientConfig): Promise<DB>;
