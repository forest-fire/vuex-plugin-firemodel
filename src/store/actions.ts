import { firemodelActions } from "./firemodelActions/index";
import { pluginActions } from "./localActions/pluginActions";

export const actions = {
  ...firemodelActions,
  ...pluginActions
};
