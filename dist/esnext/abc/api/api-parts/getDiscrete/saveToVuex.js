import { getStore } from "../../../..";
export function saveToVuex(mutation, results) {
    const store = getStore();
    store.commit(`${this.vuex.moduleName}/${mutation}`, results);
}
