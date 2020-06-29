import { changeRoot, isRecord } from '../shared';
import Vue from "vue";
export function watchEvents(propOffset) {
    const offset = !propOffset ? "all" : propOffset;
    return {
        /**
         * Bring in the server's current state at the point that a
         * watcher has been setup.
         */
        ["SERVER_STATE_SYNC" /* serverStateSync */](state, payload) {
            if (isRecord(state, payload)) {
                changeRoot(state, payload.value, payload.localPath);
            }
            else {
                Vue.set(state, offset, payload.value);
            }
        }
    };
}
