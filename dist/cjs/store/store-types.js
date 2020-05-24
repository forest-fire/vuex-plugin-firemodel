"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FiremodelModule = exports.generateLocalId = void 0;
const private_1 = require("../private");
function generateLocalId(compositeKey, action) {
    return action;
}
exports.generateLocalId = generateLocalId;
/**
 * The **Vuex** module that this plugin exports
 */
exports.FiremodelModule = () => ({
    state: private_1.state(),
    mutations: private_1.mutations(),
    actions: private_1.actions(),
    namespaced: true
});
//# sourceMappingURL=store-types.js.map