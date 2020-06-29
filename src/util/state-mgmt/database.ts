import type {  IAbstractedDatabase } from 'universal-fire';

import { FireModelPluginError } from "@/errors";

let _db: IAbstractedDatabase;
/**
 * provides access to the database that was passed in by the consuming application
 */
export function getDatabase(): IAbstractedDatabase {
  if(!_db) {
    throw new FireModelPluginError(`A call to database() failed because the database was not set!`)
  }
  return _db;
}

export function storeDatabase(db : IAbstractedDatabase) {
  _db = db
}