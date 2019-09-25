"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const addedLocally_1 = require("./addedLocally");
const serverEvents_1 = require("./serverEvents");
const serverRollbacks_1 = require("./serverRollbacks");
const serverConfirms_1 = require("./serverConfirms");
/**
 * **firebaseMutations**
 *
 * A prepacked set of mutations which will handle all the mutations
 * which the **Firemodel Vuex Plugin** will send relating to CRUD based
 * changes to the underlying Firebase database.
 *
 * These mutations can/should be brought into parts of the state tree which
 * are managed by a Firemodel `Model` (and are being "watched" by your frontend).
 * This export is able to manage the mutations for both `record` and `list` based
 * watchers.
 *
 * An example of how to incorporate into your state tree:
```typescript
const vuexModule: Module<IMyStateModule, IRootState> = {
    state,
    ...firemodelMutations(),
    getters,
    namespaced: true
}
```
 */
function firemodelMutations(
/**
 * If you are using a **list** based watcher you will almost always want
 * the list of records to be "offset" from the root of the local state
 * module. If not stated, this property will be offset to `all` but you can
 * explicitly set it to whatever you like including an empty string which will
 * in effect put the list onto the root of the local state module.
 *
 * In the case of a **record** based watcher you should typically leave this property
 * `undefined` but if you have an edge case then you can set it to whatever you like
 * and it will honored.
 */
propOffset) {
    const a = Object.assign(Object.assign(Object.assign(Object.assign({}, addedLocally_1.addedLocally(propOffset)), serverEvents_1.serverEvents(propOffset)), serverRollbacks_1.serverRollbacks(propOffset)), serverConfirms_1.serverConfirms(propOffset));
    return a;
}
exports.firemodelMutations = firemodelMutations;
//# sourceMappingURL=index.js.map