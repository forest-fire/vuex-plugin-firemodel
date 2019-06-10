import { firemodelActions } from "./firemodelActions";
import { pluginActions } from "./localActions/pluginActions";

export const actions = {
  ...firemodelActions,
  ...pluginActions
};
