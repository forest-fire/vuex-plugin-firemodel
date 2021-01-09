import {
  authActions,
  errors,
  other,
  recordConfirms,
  recordLocal,
  recordRollbacks,
  recordServerChanges,
  relationship,
  watchActions
} from "@/store";

import { ActionTree } from "vuex";
import type { IFiremodelState } from "@/types";

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
  }) as ActionTree<IFiremodelState<T>, T>;

function stripNamespaceFromKeys<T>(global: ActionTree<IFiremodelState<T>, T>) {
  const local: ActionTree<IFiremodelState<T>, T> = {};
  Object.keys(global).forEach(key => {
    local[key.replace("@firemodel/", "")] = global[key];
  });

  return local;
}
