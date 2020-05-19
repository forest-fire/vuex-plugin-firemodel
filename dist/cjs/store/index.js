"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FiremodelModule = exports.generateLocalId = void 0;
const state_1 = require("./state");
const index_1 = require("./mutations/index");
const actions_1 = require("./actions");
function generateLocalId(compositeKey, action) {
    return action;
}
exports.generateLocalId = generateLocalId;
var database_1 = require("../shared/database");
Object.defineProperty(exports, "database", { enumerable: true, get: function () { return database_1.database; } });
const mutationTypes = Object.keys(index_1.mutations).filter(i => typeof i !== "function");
/**
 * The **Vuex** module that this plugin exports
 */
exports.FiremodelModule = () => ({
    state: state_1.state(),
    mutations: index_1.mutations(),
    actions: actions_1.actions(),
    namespaced: true
});
//# sourceMappingURL=index.js.map