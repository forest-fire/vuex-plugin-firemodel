import { IDictionary } from "common-types";
interface IDictionaryWithId extends IDictionary {
    id: string;
}
/**
 * **updateList**
 *
 * Updates a module's state tree for a property which is based on a "list watcher";
 * the actual _list_ data will be based off the root of module state if no `moduleState`
 * is passed in; in other cases it will use the `moduleState` as an offset to arrive
 * at the root of the array.
 *
 * @param moduleState the module state tree
 * @param offset the offset from the root where the data is stored;
 * by default it is "all" but can be anything including _undefined_ (aka, no offset)
 * @param value the value of the record which has changed
 */
export declare function updateList<T extends IDictionary>(moduleState: T, offset: keyof T, 
/** the new record value OR "null" if removing the record */
value: IDictionaryWithId | null): void;
export {};
