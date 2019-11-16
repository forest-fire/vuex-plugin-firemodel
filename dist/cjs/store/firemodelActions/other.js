"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.other = () => ({
    async RESET({ commit }, module) {
        commit(`${module}/RESET`, { module });
    }
});
//# sourceMappingURL=other.js.map