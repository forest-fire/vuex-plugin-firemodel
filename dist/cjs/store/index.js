"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const state_1 = require("./state");
const index_1 = require("./mutations/index");
const actions_1 = require("./actions");
function generateLocalId(compositeKey, action) {
    return action;
}
exports.generateLocalId = generateLocalId;
const mutationTypes = Object.keys(index_1.mutations).filter(i => typeof i !== "function");
/**
 * The **Vuex** module that this plugin exports
 */
exports.FiremodelModule = {
    state: state_1.state,
    mutations: index_1.mutations,
    actions: actions_1.actions,
    namespaced: true
};
//# sourceMappingURL=index.js.map