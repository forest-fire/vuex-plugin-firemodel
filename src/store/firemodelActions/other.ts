import { ActionTree } from "vuex";
import type { IFiremodelState } from "@/types";

export const other = <T>() =>
  ({
    /**
     * Resets a given module name back to it's default state
     */
    async RESET({ commit }, module: string) {
      commit(`${module}/RESET`, { module }, { root: true });
    }
  } as ActionTree<IFiremodelState<T>, T>);
