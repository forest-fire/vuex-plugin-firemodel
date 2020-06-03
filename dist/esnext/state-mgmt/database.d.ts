import type { FirestoreClient, RealTimeClient } from 'universal-fire';
/**
 * provides access to the database that was passed in by the consuming application
 */
export declare function getDatabase(): FirestoreClient | RealTimeClient;
export declare function storeDatabase(db: FirestoreClient | RealTimeClient): void;
