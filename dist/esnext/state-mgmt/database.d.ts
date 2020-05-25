import { IAbstractedDatabase } from 'universal-fire';
/**
 * provides access to the database that was passed in by the consuming application
 */
export declare function database(): import("@forest-fire/abstracted-database").AbstractedDatabase;
export declare function storeDatabase(db: IAbstractedDatabase): void;
