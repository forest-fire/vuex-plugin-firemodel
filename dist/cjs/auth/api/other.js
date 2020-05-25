"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetModule = void 0;
const private_1 = require("../../private");
function resetModule(module) {
    return private_1.getStore().commit(`${module}/RESET`, module);
}
exports.resetModule = resetModule;
//# sourceMappingURL=other.js.map