import { state } from "./state";
import { mutations } from "./mutations";
import { actionsConfig } from "./actionsConfig";
import { actionsCrud } from "./actionsCrud";
export function generateLocalId(compositeKey, action) {
    // return createCompositeKeyString(compositeKey) + '-' + action
    return action;
}
const mutationTypes = Object.keys(mutations).filter(i => typeof i !== "function");
/**
 * The **Vuex** module that this plugin exports
 */
export const FiremodelModule = Object.assign({ state,
    mutations }, Object.assign({}, actionsConfig, actionsCrud), { namespaced: true });
