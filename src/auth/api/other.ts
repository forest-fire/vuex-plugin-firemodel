import { getStore } from "../../index";

export function resetModule(module: string) {
  return getStore().commit(`${module}/RESET`, module);
}
