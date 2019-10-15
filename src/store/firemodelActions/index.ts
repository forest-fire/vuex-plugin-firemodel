import { recordServerChanges } from "./recordServerChanges";
import { ActionTree } from "vuex";
import { IFiremodelState } from "../..";
import { watch } from "./watch";
import { relationship } from "./relationship";
import { recordLocal } from "./recordLocal";
import { recordConfirms } from "./recordConfirms";
import { recordRollbacks } from "./recordRollbacks";
import { authActions } from "./auth";
import { errors } from "./errors";

export const firemodelActions = <T>() =>
  stripNamespaceFromKeys<T>({
    ...errors<T>(),
    ...authActions<T>(),
    ...recordServerChanges<T>(),
    ...recordLocal<T>(),
    ...recordConfirms<T>(),
    ...recordRollbacks<T>(),
    ...watch<T>(),
    ...relationship<T>()
  }) as ActionTree<IFiremodelState<T>, T>;

function stripNamespaceFromKeys<T>(global: ActionTree<IFiremodelState<T>, T>) {
  const local: ActionTree<IFiremodelState<T>, T> = {};
  Object.keys(global).forEach(key => {
    local[key.replace("@firemodel/", "")] = global[key];
  });

  return local;
}
