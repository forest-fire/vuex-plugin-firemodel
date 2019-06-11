import { localConfig } from "./localConfig";
import { serverConfirm } from "./serverConfirm";
import { watcher } from "./watcher";
import { localCrud } from "./localCrud";

/**
 * The **mutations** to the `@firemodel` state node; this state node will be off the
 * root of a state tree which is defined by the application but remains
 * unknown/generic to this plugin
 */
export const mutations = {
  ...localConfig,
  ...serverConfirm,
  ...localCrud,
  ...watcher
};
