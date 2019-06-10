import { pathJoin } from "common-types";
import { set } from "lodash";
import { changeRoot } from "../shared/changeRoot";
export function addedLocally(propOffset) {
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
        }
    };
}
