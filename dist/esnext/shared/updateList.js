import { FireModelPluginError } from "../errors/FiremodelPluginError";
import { changeRoot } from "./changeRoot";
export function updateList(moduleState, offset, 
/** the new record value OR "null" if removing the record */
value) {
    const existing = (offset ? moduleState[offset] : moduleState) || [];
    if (!Array.isArray(existing)) {
        throw new FireModelPluginError(`Attempt to update a list of records but the existing state [ offset: ${offset} ] is not an array [ ${typeof existing} ]`);
    }
    const updated = existing.map(i => {
        return value && i.id === value.id ? value : i;
    });
    if (!offset) {
        // must deal with root object de-referencing
        changeRoot(moduleState, updated);
    }
    else {
        // just set the offset property and state will change
        moduleState[offset] = updated;
    }
}
