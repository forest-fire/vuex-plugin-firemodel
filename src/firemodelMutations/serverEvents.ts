import { MutationTree } from "vuex";
import { IDictionary } from "firemock";
import { FmCrudMutation } from "../types/mutations/FmCrudMutation";
import { IFmContextualizedWatchEvent, pathJoin, Model } from "firemodel";
import { IPathSetter } from "abstracted-firebase";
import { changeRoot } from "../shared/changeRoot";
import set from "lodash.set";

export function serverEvents<T = MutationTree<IDictionary>>(
  propOffset?: string
): MutationTree<T> {
  return {
    [FmCrudMutation.serverAdd](
      state: IDictionary,
      payload: IFmContextualizedWatchEvent<T> & { paths?: IPathSetter<T> }
    ) {
      const isRecord = payload.watcherSource === "record";
      state = isRecord
        ? (changeRoot(state, payload.value) as T)
        : propOffset
        ? state[propOffset].push(payload.value)
        : state.push(payload.value);
    },

    [FmCrudMutation.serverChange]<T extends Model>(
      state: IDictionary,
      payload: IFmContextualizedWatchEvent<T>
    ) {
      const isRecord = payload.watcherSource === "record";
      const updatedList = (list: T[]) => {
        if (payload.value === null) {
          // a "remove" event will also be picked up by the "change" event
          // passed by Firebase. This mutation will be ignored with the
          // assumption that the "remove" mutation will handle the state
          // change.
          return list || [];
        }
        if (!(list || []).map(i => i.id).includes(payload.value.id)) {
          // The "change" is to a record which did not previously
          // exist. This is because "change" is a superset of add/remove/update.
          // It is asssumed in this case that the "serverAdd" event will have
          // taken care of the needed state change.
          return list || [];
        }

        return (list || []).map(i => {
          return i.id === payload.value.id ? payload.value : i;
        });
      };

      state = isRecord
        ? (changeRoot(state, payload.value) as T)
        : propOffset
        ? (state[propOffset] = updatedList(payload.value))
        : (state = updatedList(payload.value));
    },

    [FmCrudMutation.serverRemove](
      state: IDictionary,
      payload: IFmContextualizedWatchEvent<T>
    ) {
      const isRecord = payload.watcherSource === "record";

      state = isRecord
        ? (changeRoot(state, payload.value) as T)
        : propOffset
        ? (state[propOffset] = null)
        : (state = null);
    }
  };
}
