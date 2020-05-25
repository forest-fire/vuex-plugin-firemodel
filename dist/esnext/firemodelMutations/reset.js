import { getInitialState } from "../private";
import Vue from "vue";
export function reset(propOffset) {
    const offset = !propOffset ? "all" : propOffset;
    return {
        ["RESET" /* reset */](state, mod) {
            if (offset && Array.isArray(state[offset])) {
                Vue.set(state, offset, []);
            }
            else {
                // TODO: make this reset to "default state" not empty state
                return Object.keys(state).forEach(p => Vue.set(state, p, getInitialState()[mod][p]));
            }
        }
    };
}
