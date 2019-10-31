import Vue from "vue";
export function reset(propOffset) {
    const offset = !propOffset ? "all" : propOffset;
    return {
        reset(state, payload) {
            if (offset && Array.isArray(state[offset])) {
                Vue.set(state, offset, []);
            }
            else {
                state = {};
            }
        }
    };
}
