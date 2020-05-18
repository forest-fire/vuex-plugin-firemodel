"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.other = void 0;
exports.other = () => ({
    /**
     * Resets a given module name back to it's default state
     */
    async RESET({ commit }, module) {
        commit(`${module}/RESET`, { module }, { root: true });
    }
});
//# sourceMappingURL=other.js.map