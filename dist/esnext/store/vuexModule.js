import { state } from "./state";
import { mutations } from "./mutations";
import { actionsConfig } from "./actionsConfig";
export function generateLocalId(compositeKey, action) {
    // return createCompositeKeyString(compositeKey) + '-' + action
    return action;
}
const mutationTypes = Object.keys(mutations).filter(i => typeof i !== "function");
/**
 * The **Vuex** module that this plugin exports
 */
const vuexModule = {
    state,
    mutations,
};
{
    actionsConfig;
}
namespaced: true;
;
export default vuexModule;
