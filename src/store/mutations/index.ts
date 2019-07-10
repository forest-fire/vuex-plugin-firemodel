import { localConfig } from "./localConfig";
import { serverConfirm } from "./serverConfirm";
import { watcher } from "./watcher";
import { localCrud } from "./localCrud";
import { errorMutations } from "./errors";

/**
 * The **mutations** to the `@firemodel` state node; this state node will be off the
 * root of a state tree which is defined by the application but remains
 * unknown/generic to this plugin
 */
export const mutations = {
  ...errorMutations,
  ...localConfig,
  ...serverConfirm,
  ...localCrud,
  ...watcher
};

export type IFiremodelMutation = keyof typeof mutations;
