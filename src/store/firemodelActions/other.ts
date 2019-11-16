import { ActionTree } from "vuex";
import { IFiremodelState } from "../../index";
import { FmEvents, IFmWatchEvent } from "firemodel";
import get from "lodash.get";
import { FmCrudMutation } from "../../types/mutations/FmCrudMutation";
import { determineLocalStateNode } from "../../shared/determineLocalStateNode";

export const other = <T>() =>
  ({
    async RESET({ commit }, module: string) {
      commit(`${module}/RESET`, { module });
    }
  } as ActionTree<IFiremodelState<T>, T>);
