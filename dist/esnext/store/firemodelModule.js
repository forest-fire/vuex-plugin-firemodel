import { state } from "./state";
import { mutations } from "./mutations";
import { actionsPlugin } from "./actionsPlugin";
import { firemodelActions } from "./firemodelActions";
export function generateLocalId(compositeKey, action) {
    // return createCompositeKeyString(compositeKey) + '-' + action
    return action;
}
const mutationTypes = Object.keys(mutations).filter(i => typeof i !== "function");
/**
 * The **Vuex** module that this plugin exports
 */
export const FiremodelModule = {
    state,
    mutations,
    actions: Object.assign({}, actionsPlugin, firemodelActions),
    namespaced: true
};
