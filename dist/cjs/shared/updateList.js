"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FiremodelPluginError_1 = require("../errors/FiremodelPluginError");
const changeRoot_1 = require("./changeRoot");
function updateList(moduleState, offset, 
/** the new record value OR "null" if removing the record */
value) {
    const existing = (offset ? moduleState[offset] : moduleState) || [];
    if (!Array.isArray(existing)) {
        throw new FiremodelPluginError_1.FireModelPluginError(`Attempt to update a list of records but the existing state [ offset: ${offset} ] is not an array [ ${typeof existing} ]`);
    }
    const updated = existing.map(i => {
        return value && i.id === value.id ? value : i;
    });
    if (!offset) {
        // must deal with root object de-referencing
        changeRoot_1.changeRoot(moduleState, updated);
    }
    else {
        // just set the offset property and state will change
        moduleState[offset] = updated;
    }
}
exports.updateList = updateList;
//# sourceMappingURL=updateList.js.map