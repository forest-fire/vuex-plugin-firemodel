"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../index");
function resetModule(module) {
    return index_1.getStore().commit(`${module}/RESET`, module);
}
exports.resetModule = resetModule;
//# sourceMappingURL=other.js.map