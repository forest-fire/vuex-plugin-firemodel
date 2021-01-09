import {
  authMutations,
  errorMutations,
  localConfig,
  localCrud,
  relationships,
  serverConfirm,
  serverRollback,
  watcher
} from "@/store";

import type { IFiremodelState } from "@/types";
import { MutationTree } from "vuex";

/**
 * The **mutations** to the `@firemodel` state node; this state node will be off the
 * root of a state tree which is defined by the application but remains
 * unknown/generic to this plugin
 */
export const mutations = <T>() =>
  ({
    ...errorMutations<T>(),
    ...localConfig<T>(),
    ...authMutations<T>(),
    ...serverConfirm<T>(),
    ...serverRollback<T>(),
    ...localCrud<T>(),
    ...relationships<T>(),
    ...watcher<T>()
  } as MutationTree<IFiremodelState<T>>);

export type IFiremodelMutation = keyof typeof mutations;
