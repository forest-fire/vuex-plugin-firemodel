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
      if (payload.value) {
        state = changeRoot(state, payload.value) as T;
      } else if (payload.paths) {
        const value = payload.paths.reduce((prev, curr) => {
          const path = pathJoin(payload.localPath, curr.path);
          set(prev, path, curr.value);
          return prev;
        }, {});
      }
    },

    [FmCrudMutation.changedLocally](
      state,
      payload: IFmContextualizedWatchEvent<T> & { paths?: IPathSetter<T> }
    ) {
      if (payload.value) {
        state = changeRoot(state, payload.value) as T;
      } else if (payload.paths) {
        //@TODO
      }
    },

    // TODO: implement
    [FmCrudMutation.removedLocally](
      state,
      payload: IFmContextualizedWatchEvent<T> & { paths?: IPathSetter<T> }
    ) {
      console.log("TOOD: removed-locally");
    }
  };
}
