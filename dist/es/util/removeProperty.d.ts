import { IDictionary } from "common-types";
/**
 * Removes a property (or set of properties) from a hash/dictionary
 */
export declare function removeProperty<T extends Object = IDictionary>(hash: T, ...remove: (string & keyof T)[]): Partial<T>;
