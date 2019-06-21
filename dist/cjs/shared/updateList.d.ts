import { IDictionary } from "common-types";
import { Model } from "firemodel";
/**
 * **updateList**
 *
 * Updates a module's state tree for a property which is based on a "list" watcher;
 * assuming there is an offsetProp, `moduleState` is expected to be Dictionary where
 * a property (defined by `propState` but typically "all") will
 * have an array of `T` in it.
 *
 * @param moduleState the root of a list watchers state tree
 * @param offset the offset from the root where the data is stored;
 * by default it is "all" but can be anything including undefined (aka, no offset)
 * @param value the value of the record which has changed
 */
export declare function updateList<T extends Model>(moduleState: IDictionary, offset: string, value: T): void;
/**
 * **updateList**
 *
 * Updates a module's state tree for a property which is based on a "list" watcher;
 * assuming there is an offsetProp, `moduleState` is expected to be an array of `T` when
 * the `propName` is undefined; alternatively stating an _offset_ changes the expectation
 * of `moduleState` to a dictionary.
 *
 * @param moduleState the root of a list watchers state tree
 * @param offset the offset from the root where the data is stored;
 * by default it is "all" but can be anything including _undefined_ (aka, no offset)
 * @param value the value of the record which has changed
 */
export declare function updateList<T extends Model>(moduleState: T[], offset: undefined, value: T): void;
