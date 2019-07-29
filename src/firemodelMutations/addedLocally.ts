import { MutationTree } from "vuex";

import { FmCrudMutation } from "../types/mutations/FmCrudMutation";
import { changeRoot } from "../shared/changeRoot";
import { updateList } from "../shared/updateList";
import { IFmWatchEvent } from "firemodel";

export function addedLocally<T>(propOffset?: keyof T): MutationTree<T> {
  const offset = !propOffset ? ("all" as keyof T) : propOffset;

  return {
    [FmCrudMutation.addedLocally](state, payload: IFmWatchEvent<T>) {
      const isRecord = payload.watcherSource === "record";
      if (isRecord) {
        changeRoot<T>(state, payload.value);
      } else {
        updateList<T>(state, offset, payload.value);
      }
    },

    [FmCrudMutation.changedLocally](state, payload: IFmWatchEvent<T>) {
      const isRecord = payload.watcherSource === "record";
      if (isRecord) {
        changeRoot<T>(state, payload.value);
      } else {
        updateList<T>(state, offset, payload.value);
      }
    },

    [FmCrudMutation.removedLocally](state: T, payload: IFmWatchEvent<T>) {
      const isRecord = payload.watcherSource === "record";
      if (isRecord) {
        changeRoot<T>(state, null);
      } else {
        updateList<T>(state, offset, null);
      }
    }
  };
}
