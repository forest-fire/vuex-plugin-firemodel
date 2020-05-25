import { IVuexState, authActions, errors, other, recordConfirms, recordLocal, recordRollbacks, recordServerChanges, relationship, watch } from "../../private";

import { ActionTree } from "vuex";

export const firemodelActions = <T>() =>
  stripNamespaceFromKeys<T>({
    ...errors<T>(),
    ...authActions<T>(),
    ...recordServerChanges<T>(),
    ...recordLocal<T>(),
    ...recordConfirms<T>(),
    ...recordRollbacks<T>(),
    ...watch<T>(),
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
