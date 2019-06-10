import { pathJoin } from "firemodel";
import set from "lodash.set";
const changeRoot = (state, newValues) => {
    Object.keys(newValues).forEach(v => {
        state[v] = newValues[v];
    });
    const removed = Object.keys(state).filter(k => !Object.keys(newValues).includes(k));
    Object.keys(removed).forEach(k => {
        delete state[k];
    });
    return state;
};
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
export function firemodelMutations(
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
    return {
        ["ADDED_LOCALLY" /* addedLocally */](state, payload) {
            if (payload.value) {
                state = changeRoot(state, payload.value);
            }
            else if (payload.paths) {
                const value = payload.paths.reduce((prev, curr) => {
                    const path = pathJoin(payload.localPath, curr.path);
                    set(prev, path, curr.value);
                    return prev;
                }, {});
            }
        },
        // TODO: validate
        ["SERVER_ADD" /* serverAdd */](state, payload) {
            if (payload.value) {
                state = changeRoot(state, payload.value);
            }
            else if (payload.paths) {
                const value = payload.paths.reduce((prev, curr) => {
                    const path = pathJoin(payload.localPath, curr.path);
                    set(prev, path, curr.value);
                    return prev;
                }, {});
            }
        },
        ["CHANGED_LOCALLY" /* changedLocally */](state, payload) {
            if (payload.value) {
                state = changeRoot(state, payload.value);
            }
            else if (payload.paths) {
                //@TODO
            }
        },
        // TODO: implement
        ["REMOVED_LOCALLY" /* removedLocally */](state, payload) {
            console.log("TOOD: removed-locally");
        },
        ["SERVER_ADD" /* serverAdd */](state, payload) {
            // TODO: implement
            console.log("TODO: server-add", payload.localPath);
        },
        ["SERVER_CHANGE" /* serverChange */](state, payload) {
            // TODO: implement
            console.log("TODO: server-change");
        },
        ["SERVER_REMOVE" /* serverRemove */](state, payload) {
            // TODO: implement
            console.log("TODO: server-remove");
        }
    };
}
