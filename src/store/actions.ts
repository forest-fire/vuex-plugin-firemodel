import { firemodelActions, pluginActions } from "@/store";

import { ActionTree } from "vuex";
import { IVuexState } from "@/types";

export const actions = <T>() =>
  ({
    ...firemodelActions<T>(),
    ...pluginActions<T>()
  } as ActionTree<IVuexState<T>, T>);
