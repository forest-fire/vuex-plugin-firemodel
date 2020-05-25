import { ActionTree } from "vuex";
import { IVuexState } from "../types";
import { firemodelActions } from "./firemodelActions/index";
import { pluginActions } from "./localActions/pluginActions";

export const actions = <T>() =>
  ({
    ...firemodelActions<T>(),
    ...pluginActions<T>()
  } as ActionTree<IVuexState<T>, T>);
