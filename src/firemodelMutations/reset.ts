import { MutationTree } from "vuex";
import { Model } from "firemodel";
import { isRecord } from "../shared/isRecord";
import { changeRoot } from "../shared/changeRoot";
import { updateList } from "../shared/updateList";

export function reset<T extends Model>(
  propOffset?: keyof T & string
): MutationTree<T> {
  const offset = !propOffset ? ("all" as keyof T & string) : propOffset;
  return {
    reset(state: any, payload: any) {
      if (isRecord(state, payload)) {
        changeRoot<T>(state, null);
      } else {
        updateList<any>(state, offset, []);
      }
    }
  };
}
