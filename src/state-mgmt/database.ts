import type { FirestoreClient, IAbstractedDatabase, RealTimeClient } from 'universal-fire';

import { FireModelPluginError } from "../private";

let _db: FirestoreClient | RealTimeClient;
/**
 * provides access to the database that was passed in by the consuming application
 */
export function getDatabase(): FirestoreClient | RealTimeClient {
  if(!_db) {
    throw new FireModelPluginError(`A call to database() failed because the database was not set!`)
  }
  return _db;
}

export function storeDatabase(db : FirestoreClient | RealTimeClient) {
  _db = db
}