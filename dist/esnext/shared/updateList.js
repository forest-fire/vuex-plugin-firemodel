import get from "lodash.get";
import set from "lodash.set";
import { FireModelPluginError } from "../errors/FiremodelPluginError";
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
export function updateList(moduleState, offset, 
/** the new record value OR "null" if removing the record */
value) {
    if (!offset) {
        throw new FireModelPluginError('"updateList" was passed a falsy value for an offset; this is not currently allowed', "not-allowed");
    }
    let existing = get(moduleState, offset, []);
    let found = false;
    let updated = existing.map(i => {
        if (value && i.id === value.id) {
            found = true;
        }
        return value && i.id === value.id ? value : i;
    });
    set(moduleState, offset, found ? updated : existing.concat(value));
}
