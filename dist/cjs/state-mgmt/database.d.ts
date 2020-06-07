import type { IAbstractedDatabase } from 'universal-fire';
/**
 * provides access to the database that was passed in by the consuming application
 */
export declare function getDatabase(): IAbstractedDatabase;
export declare function storeDatabase(db: IAbstractedDatabase): void;
