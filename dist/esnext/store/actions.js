import { firemodelActions } from "./firemodelActions";
import { pluginActions } from "./localActions/pluginActions";
export const actions = Object.assign({}, firemodelActions, pluginActions);
