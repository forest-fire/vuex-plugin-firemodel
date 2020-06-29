import { IAbcFirebaseQueryResult } from "../../../private";
import { IDictionary } from "common-types";
import { Model } from "firemodel";
export interface IGeneralizedFiremodelQuery<T extends Model> {
    (): Promise<IAbcFirebaseQueryResult<T>>;
}
/**
 * Given a Primary Key _reference_ string; this function will find the record
 * which matches the primary key.
 *
 * If no record is found then `false` is returned. If _more_ than one result is
 * found than an error is thrown.
 */
export declare function findPk<T extends IDictionary>(pk: string, records: T[]): T | false;
