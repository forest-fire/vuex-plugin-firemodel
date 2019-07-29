import { localConfig } from "./localConfig";
import { serverConfirm } from "./serverConfirm";
import { authMutations } from "./auth";
import { watcher } from "./watcher";
import { localCrud } from "./localCrud";
import { errorMutations } from "./errors";
import { MutationTree } from "vuex";
import { IFiremodelState } from "../../types";

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
    ...localCrud<T>(),
    ...watcher<T>()
  } as MutationTree<IFiremodelState<T>>);

export type IFiremodelMutation = keyof typeof mutations;
