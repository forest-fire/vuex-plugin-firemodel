import { actions, mutations, state } from "../private";
export function generateLocalId(compositeKey, action) {
    return action;
}
/**
 * The **Vuex** module that this plugin exports
 */
export const FiremodelModule = () => ({
    state: state(),
    mutations: mutations(),
    actions: actions(),
    namespaced: true
});
