import { getStore } from "../../index";
export function resetModule(module) {
    return getStore().commit(`${module}/RESET`, module);
}
