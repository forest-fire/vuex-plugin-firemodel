import { state } from "./state";
import { mutations } from "./mutations/index";
import { actions } from "./actions";
export function generateLocalId(compositeKey, action) {
    return action;
}
export { database } from "../shared/database";
const mutationTypes = Object.keys(mutations).filter(i => typeof i !== "function");
/**
 * The **Vuex** module that this plugin exports
 */
export const FiremodelModule = {
    state,
    mutations,
    actions,
    namespaced: true
};
