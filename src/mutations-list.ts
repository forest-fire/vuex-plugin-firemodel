import { MutationTree } from "vuex";
import { Model, IFmContextualizedWatchEvent } from "firemodel";

export type ListPropertyCandidates<T> = Pick<
  T,
  { [K in keyof T]: T[K] extends Model[] ? K : never }[keyof T]
>;

export function listMutations<T>(
  postfix: keyof ListPropertyCandidates<T>
): MutationTree<T> {
  return {
    ADD(state, payload: IFmContextualizedWatchEvent) {
      (state[postfix] as any).push(payload.value);
    },
    CHANGED(state, payload) {},
    REMOVED(state, payload) {},
    RELATIONSHIP_ADDED(state, payload) {},
    RELATIONSHIP_REMOVED(state, payload) {}
  };
}
