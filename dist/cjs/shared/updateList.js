"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = __importDefault(require("vue"));
const FiremodelPluginError_1 = require("../errors/FiremodelPluginError");
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
function updateList(moduleState, offset, 
/** the new record value OR "null" if removing the record */
value) {
    if (!offset) {
        throw new FiremodelPluginError_1.FireModelPluginError('"updateList" was passed a falsy value for an offset; this is not currently allowed', "not-allowed");
    }
    let existing = moduleState[offset] || [];
    let found = false;
    let updated = existing.map(i => {
        if (value && i.id === value.id) {
            found = true;
        }
        return value && i.id === value.id ? value : i;
    });
    vue_1.default.set(moduleState, offset, found ? updated : existing.concat(value));
    // set<IDictionaryWithId>(
    //   moduleState,
    //   offset,
    //   found ? updated : existing.concat(value as IDictionaryWithId)
    // );
}
exports.updateList = updateList;
//# sourceMappingURL=updateList.js.map