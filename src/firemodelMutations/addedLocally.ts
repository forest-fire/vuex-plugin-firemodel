import { MutationTree } from "vuex";
import { FmCrudMutation } from "../types/mutations/FmCrudMutation";
import { changeRoot } from "../shared/changeRoot";
import { updateList } from "../shared/updateList";
import { IFmWatchEvent } from "firemodel";
import { IDictionary } from "firemock";
import { isRecord } from "../shared/isRecord";

export function addedLocally<T>(
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
