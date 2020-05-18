"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errors = void 0;
const firemodel_1 = require("firemodel");
exports.errors = () => ({
    async [firemodel_1.FmEvents.UNEXPECTED_ERROR](_, payload) {
        console.warn(`An unexpected Firemodel error occurred`, payload);
    }
});
//# sourceMappingURL=errors.js.map