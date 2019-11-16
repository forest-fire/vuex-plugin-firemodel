import { MutationTree } from "vuex";
import { Model } from "firemodel";
import Vue from "vue";
import { FmCrudMutation } from "../types";
import { initialState } from "..";

export function reset<T extends Model>(
  propOffset?: keyof T & string
): MutationTree<T> {
  const offset = !propOffset ? ("all" as keyof T & string) : propOffset;
  return {
    [FmCrudMutation.reset](state: any, payload: any) {
      if (offset && Array.isArray(state[offset])) {
        Vue.set(state, offset, []);
      } else {
        // TODO: make this reset to "default state" not empty state
        return Object.keys(state).forEach(p =>
          Vue.set(state, p, initialState[p])
        );
      }
    }
  };
}
