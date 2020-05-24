import { IVuexState } from "../../private";
import { MutationTree } from "vuex";
import { authMutations } from "./auth";
import { errorMutations } from "./errors";
import { localConfig } from "./localConfig";
import { localCrud } from "./localCrud";
import { relationships } from "./relationships";
import { serverConfirm } from "./serverConfirm";
import { serverRollback } from "./serverRollback";
import { watcher } from "./watcher";

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
  } as MutationTree<IVuexState<T>>);

export type IFiremodelMutation = keyof typeof mutations;
