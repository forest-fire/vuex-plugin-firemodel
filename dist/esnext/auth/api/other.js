import { getStore } from "../../private";
export function resetModule(module) {
    return getStore().commit(`${module}/RESET`, module);
}
