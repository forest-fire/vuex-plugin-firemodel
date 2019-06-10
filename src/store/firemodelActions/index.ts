import { record } from "./record";
import { ActionTree } from "vuex";
import { IFiremodelState, IGenericStateTree } from "../..";
import { watch } from "./watch";
import { relationship } from "./relationship";

export const firemodelActions: ActionTree<
  IFiremodelState,
  IGenericStateTree
> = stripNamespaceFromKeys({
  ...record,
  ...watch,
  ...relationship
});

function stripNamespaceFromKeys(global: ActionTree<IFiremodelState, IGenericStateTree>) {
  const local: ActionTree<IFiremodelState, IGenericStateTree> = {};
  Object.keys(global).forEach(key => {
    local[key.replace("@firemodel/", "")] = global[key];
  });

  return local;
}
