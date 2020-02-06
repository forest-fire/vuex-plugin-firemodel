import { IDictionary } from "firemock";
/**
 * Given a Primary Key _reference_ string; this function will find the record
 * which matches the primary key.
 *
 * If no record is found then `false` is returned. If _more_ than one result is
 * found than an error is thrown.
 */
export declare function findPk<T extends IDictionary>(pk: string, records: T[]): T | false;
