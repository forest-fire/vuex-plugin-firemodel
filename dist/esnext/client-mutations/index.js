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
export function recordMutations() {
    return {
        ADD(state, payload) {
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
        CHANGED_LOCALLY(state, payload) {
            if (payload.value) {
                state = changeRoot(state, payload.value);
            }
            else if (payload.paths) {
                //@TODO
            }
        },
        CHANGED(state, payload) {
            if (payload.value) {
                state = changeRoot(state, payload.value);
            }
            else if (payload.paths) {
                //@TODO
            }
        },
        REMOVED(state, payload) {
            //
        },
        RELATIONSHIP_ADDED(state, payload) {
            //
        },
        RELATIONSHIP_REMOVED(state, payload) {
            //
        }
    };
}
