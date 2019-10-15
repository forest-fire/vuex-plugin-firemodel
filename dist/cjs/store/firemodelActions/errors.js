"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firemodel_1 = require("firemodel");
exports.errors = () => ({
    async [firemodel_1.FmEvents.UNEXPECTED_ERROR](_, payload) {
        console.warn(`An unexpected Firemodel error occurred`, payload);
    }
});
//# sourceMappingURL=errors.js.map