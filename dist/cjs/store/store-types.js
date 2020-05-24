"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FiremodelModule = exports.generateLocalId = void 0;
const private_1 = require("../private");
function generateLocalId(compositeKey, action) {
    return action;
}
exports.generateLocalId = generateLocalId;
var database_1 = require("../state-mgmt/database");
Object.defineProperty(exports, "database", { enumerable: true, get: function () { return database_1.database; } });
const mutationTypes = Object.keys(private_1.mutations).filter(i => typeof i !== "function");
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