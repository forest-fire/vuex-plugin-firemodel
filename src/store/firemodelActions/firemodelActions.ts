import { authActions, errors, other, recordConfirms, recordLocal, recordRollbacks, recordServerChanges, relationship, watchActions } from "@/store";

import { ActionTree } from "vuex";
import { IVuexState } from "@/types"

export const firemodelActions = <T>() =>
  stripNamespaceFromKeys<T>({
    ...errors<T>(),
    ...authActions<T>(),
    ...recordServerChanges<T>(),
    ...recordLocal<T>(),
    ...recordConfirms<T>(),
    ...recordRollbacks<T>(),
    ...watchActions<T>(),
    ...relationship<T>(),
    ...other<T>()
  }) as ActionTree<IVuexState<T>, T>;

function stripNamespaceFromKeys<T>(global: ActionTree<IVuexState<T>, T>) {
  const local: ActionTree<IVuexState<T>, T> = {};
  Object.keys(global).forEach(key => {
    local[key.replace("@firemodel/", "")] = global[key];
  });

  return local;
}
