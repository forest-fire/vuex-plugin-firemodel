import { getStore } from "@/util";

export function resetModule(module: string) {
  return getStore().commit(`${module}/RESET`, module);
}
