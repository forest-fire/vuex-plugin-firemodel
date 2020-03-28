"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../../..");
function saveToVuex(mutation, results) {
    const store = __1.getStore();
    store.commit(`${this.vuex.moduleName}/${mutation}`, results);
}
exports.saveToVuex = saveToVuex;
//# sourceMappingURL=saveToVuex.js.map