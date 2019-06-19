import { IDictionary } from "common-types";
import { Model } from "firemodel";
import { FireModelPluginError } from "../errors/FiremodelPluginError";
import { changeRoot } from "./changeRoot";

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
export function updateList<T extends Model>(
  moduleState: IDictionary,
  offset: string,
  value: T
): void;
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
export function updateList<T extends Model>(
  moduleState: T[],
  offset: undefined,
  value: T
): void;
export function updateList<T extends Model>(
  moduleState: IDictionary | T[],
  offset: string | undefined,
  /** the new record value OR "null" if removing the record */
  value: T | null
): void {
  const existing: T[] =
    (offset ? (moduleState as IDictionary)[offset] : moduleState) || [];
  if (!Array.isArray(existing)) {
    throw new FireModelPluginError(
      `Attempt to update a list of records but the existing state [ offset: ${offset} ] is not an array [ ${typeof existing} ]`
    );
  }

  const updated = existing.map(i => {
    return value && i.id === value.id ? value : i;
  });

  if (!offset) {
    // must deal with root object de-referencing
    changeRoot(moduleState, updated);
  } else {
    // just set the offset property and state will change
    (moduleState as IDictionary)[offset] = updated;
  }
}
