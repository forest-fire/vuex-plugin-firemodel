import { actions, mutations, state } from "../private";
export function generateLocalId(compositeKey, action) {
    return action;
}
export { database } from "../state-mgmt/database";
const mutationTypes = Object.keys(mutations()).filter(i => typeof i !== "function");
/**
 * The **Vuex** module that this plugin exports
 */
export const FiremodelModule = () => ({
    state: state(),
    mutations: mutations(),
    actions: actions(),
    namespaced: true
});
