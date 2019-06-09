"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const state_1 = require("./state");
const mutations_1 = require("./mutations");
const actionsConfig_1 = require("./actionsConfig");
const actionsCrud_1 = require("./actionsCrud");
function generateLocalId(compositeKey, action) {
    // return createCompositeKeyString(compositeKey) + '-' + action
    return action;
}
exports.generateLocalId = generateLocalId;
const mutationTypes = Object.keys(mutations_1.mutations).filter(i => typeof i !== "function");
/**
 * The **Vuex** module that this plugin exports
 */
exports.FiremodelModule = Object.assign({ state: state_1.state,
    mutations: mutations_1.mutations }, Object.assign({}, actionsConfig_1.actionsConfig, actionsCrud_1.actionsCrud), { namespaced: true });
//# sourceMappingURL=firemodelModule.js.map