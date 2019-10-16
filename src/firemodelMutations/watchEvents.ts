import { MutationTree } from "vuex";
import { FmCrudMutation } from "../types";
import { IFmWatchEvent } from "firemodel";
import { IDictionary } from "common-types";
import { isRecord } from "../shared/isRecord";
import { changeRoot } from "../shared/changeRoot";
import { updateList } from "../shared/updateList";

export function watchEvents<T>(propOffset?: keyof T & string): MutationTree<T> {
  const offset = !propOffset ? ("all" as keyof T & string) : propOffset;

  return {
    [FmCrudMutation.serverStateSync](
      state: T | IDictionary<T[]>,
      payload: IFmWatchEvent<T>
    ) {
      console.log(payload);
      if (isRecord(state, payload)) {
        changeRoot<T>(state, payload.value);
      } else {
        updateList<T>(state, offset, payload.value);
      }
    }
  };
}
