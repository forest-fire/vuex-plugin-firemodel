import { MutationTree } from "vuex";

import { FmCrudMutation } from "../types/mutations/FmCrudMutation";
import { IFmContextualizedWatchEvent, Model } from "firemodel";
import { changeRoot } from "../shared/changeRoot";
import { IFiremodelState } from "../types";
import { localChange } from "../shared/localChange";

export function addedLocally<T extends Model>(
  propOffset?: string
): MutationTree<IFiremodelState> {
  return {
    [FmCrudMutation.addedLocally](
      state,
      payload: IFmContextualizedWatchEvent<T>
    ) {
      const isRecord = payload.watcherSource === "record";
      state = isRecord
        ? (changeRoot(state, payload.value) as T)
        : (state[propOffset as keyof typeof state] = payload.value);
    },

    [FmCrudMutation.changedLocally](
      state,
      payload: IFmContextualizedWatchEvent<T>
    ) {
      const isRecord = payload.watcherSource === "record";
      state = isRecord
        ? (changeRoot(state, payload.value) as T)
        : (state[propOffset as keyof typeof state] = payload.value);
    },

    [FmCrudMutation.removedLocally](
      state: IFiremodelState,
      payload: IFmContextualizedWatchEvent<T>
    ) {
      state.localOnly = state.localOnly.concat(localChange(payload));
    }
  };
}
