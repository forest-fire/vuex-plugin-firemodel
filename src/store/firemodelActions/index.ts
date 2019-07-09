import { recordServerChanges } from "./recordServerChanges";
import { ActionTree } from "vuex";
import { IFiremodelState, IGenericStateTree } from "../..";
import { watch } from "./watch";
import { relationship } from "./relationship";
import { recordLocal } from "./recordLocal";
import { recordConfirms } from "./recordConfirms";
import { recordRollbacks } from "./recordRollbacks";
import { authActions } from "./auth";

export const firemodelActions: ActionTree<
  IFiremodelState,
  IGenericStateTree
> = stripNamespaceFromKeys({
  ...authActions,
  ...recordServerChanges,
  ...recordLocal,
  ...recordConfirms,
  ...recordRollbacks,
  ...watch,
  ...relationship
});

function stripNamespaceFromKeys(
  global: ActionTree<IFiremodelState, IGenericStateTree>
) {
  const local: ActionTree<IFiremodelState, IGenericStateTree> = {};
  Object.keys(global).forEach(key => {
    local[key.replace("@firemodel/", "")] = global[key];
  });

  return local;
}
