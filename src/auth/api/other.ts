import { getStore } from "../../private";

export function resetModule(module: string) {
  return getStore().commit(`${module}/RESET`, module);
}
