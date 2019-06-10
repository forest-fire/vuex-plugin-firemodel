import { MutationTree } from "vuex";

import { IDictionary } from "firemock";
import { FmCrudMutation } from "../types/mutations/FmCrudMutation";
import { IFmContextualizedWatchEvent } from "firemodel";
import { IPathSetter } from "abstracted-firebase";
import { pathJoin } from "common-types";
import { set } from "lodash";
import { changeRoot } from "../shared/changeRoot";

export function serverEvents<T = MutationTree<IDictionary>>(
  propOffset?: string
): MutationTree<T> {
  return {
    [FmCrudMutation.serverAdd](
      state,
      payload: IFmContextualizedWatchEvent<T> & { paths?: IPathSetter<T> }
    ) {
      const offset = propOffset
        ? propOffset
        : payload.watcherSource === "list"
        ? "all"
        : "";
      state = offset ? { state, [offset]: payload.value } : payload.value;
    },

    [FmCrudMutation.serverChange](
      state,
      payload: IFmContextualizedWatchEvent<T> & { paths?: IPathSetter<T> }
    ) {
      // TODO: implement
      console.log("TODO: server-change");
    },

    [FmCrudMutation.serverRemove](
      state,
      payload: IFmContextualizedWatchEvent<T> & { paths?: IPathSetter<T> }
    ) {
      // TODO: implement
      console.log("TODO: server-remove");
    }
  };
}
