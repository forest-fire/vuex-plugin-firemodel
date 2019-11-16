"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.other = () => ({
    async reset({ commit }, module) {
        commit(`${module}/reset`, { module });
    }
});
//# sourceMappingURL=other.js.map