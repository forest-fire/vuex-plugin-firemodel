import { changeRoot, isRecord, updateList } from "@/util";

import { FmCrudMutation } from "@/enums";
import { IDictionary } from "common-types";
import { IFmWatchEvent, IModel } from "firemodel";
import { MutationTree } from "vuex";

export function addedLocally<T extends IModel>(
  propOffset?: keyof T & string
): MutationTree<T> {
  const offset = !propOffset ? ("all" as keyof T & string) : propOffset;

  return {
    [FmCrudMutation.addedLocally](
      state: T | IDictionary<T[]>,
      payload: IFmWatchEvent<T>
    ) {
      if (isRecord(state, payload)) {
        changeRoot<T>(state, payload.value, payload.localPath);
      } else {
        updateList<T>(state, offset, payload.value);
      }
    },

    [FmCrudMutation.changedLocally](state, payload: IFmWatchEvent<T>) {
      if (isRecord(state, payload)) {
        changeRoot<T>(state, payload.value, payload.localPath);
      } else {
        updateList<T>(state, offset, payload.value);
      }
    },

    [FmCrudMutation.removedLocally](state: T, payload: IFmWatchEvent<T>) {
      if (isRecord(state, payload)) {
        changeRoot<T>(state, null, payload.localPath);
      } else {
        updateList<T>(state, offset, null);
      }
    }
  };
}
