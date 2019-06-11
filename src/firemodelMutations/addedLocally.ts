import { MutationTree } from "vuex";

import { IDictionary } from "firemock";
import { FmCrudMutation } from "../types/mutations/FmCrudMutation";
import { IFmContextualizedWatchEvent } from "firemodel";
import { IPathSetter } from "abstracted-firebase";
import { pathJoin } from "common-types";
import { set } from "lodash";
import { changeRoot } from "../shared/changeRoot";

export function addedLocally<T = MutationTree<IDictionary>>(
  propOffset?: string
): MutationTree<T> {
  return {
    [FmCrudMutation.addedLocally](
      state,
      payload: IFmContextualizedWatchEvent<T> & { paths?: IPathSetter<T>[] }
    ) {
      const isRecord = payload.watcherSource === "record";
      state = isRecord
        ? (changeRoot(state, payload.value) as T)
        : (state[propOffset as keyof typeof state] = payload.value);
    },

    [FmCrudMutation.changedLocally](
      state,
      payload: IFmContextualizedWatchEvent<T> & { paths?: IPathSetter<T> }
    ) {
      const isRecord = payload.watcherSource === "record";
      state = isRecord
        ? (changeRoot(state, payload.value) as T)
        : (state[propOffset as keyof typeof state] = payload.value);
    },

    [FmCrudMutation.removedLocally](
      state,
      payload: IFmContextualizedWatchEvent<T> & { paths?: IPathSetter<T> }
    ) {
      const isRecord = payload.watcherSource === "record";
      state = isRecord
        ? (changeRoot(state, null) as T)
        : (state[propOffset as keyof typeof state] = null);
    }
  };
}
