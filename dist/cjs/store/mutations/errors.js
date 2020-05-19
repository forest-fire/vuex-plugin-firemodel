"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMutations = void 0;
/**
 * The **mutations** associated to errors encountered during the
 * plugin's execution.
 */
exports.errorMutations = () => ({
    error(state, err) {
        state.errors = state.errors ? state.errors.concat(err) : [err];
    }
});
//# sourceMappingURL=errors.js.map