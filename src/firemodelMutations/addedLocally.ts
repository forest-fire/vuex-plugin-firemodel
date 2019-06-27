import { MutationTree } from "vuex";

import { FmCrudMutation } from "../types/mutations/FmCrudMutation";
import { IFmContextualizedWatchEvent, Model } from "firemodel";
import { changeRoot } from "../shared/changeRoot";
import { updateList } from "../shared/updateList";

export function addedLocally<T>(propOffset?: keyof T): MutationTree<T> {
  const offset = !propOffset ? ("all" as keyof T) : propOffset;

  return {
    [FmCrudMutation.addedLocally](
      state,
      payload: IFmContextualizedWatchEvent<T>
    ) {
      const isRecord = payload.watcherSource === "record";
      if (isRecord) {
        changeRoot<T>(state, payload.value);
      } else {
        updateList<T>(state, offset, payload.value);
      }
    },

    [FmCrudMutation.changedLocally](
      state,
      payload: IFmContextualizedWatchEvent<Model>
    ) {
      const isRecord = payload.watcherSource === "record";
      if (isRecord) {
        changeRoot<T>(state, payload.value);
      } else {
        updateList<T>(state, offset, payload.value);
      }
    },

    [FmCrudMutation.removedLocally](
      state: T,
      payload: IFmContextualizedWatchEvent<Model>
    ) {
      const isRecord = payload.watcherSource === "record";
      if (isRecord) {
        changeRoot<T>(state, null);
      } else {
        updateList<T>(state, offset, null);
      }
    }
  };
}
