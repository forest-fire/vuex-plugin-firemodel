import { firemodelActions } from "./firemodelActions/index";
import { pluginActions } from "./localActions/pluginActions";
import { ActionTree } from "vuex";
import { IFiremodelState } from "../types";

export const actions = <T>() =>
  ({
    ...firemodelActions<T>(),
    ...pluginActions<T>()
  } as ActionTree<IFiremodelState<T>, T>);
