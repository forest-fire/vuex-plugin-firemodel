import { MutationTree } from "vuex";
import { Model } from "firemodel";
import { isRecord } from "../shared/isRecord";
import Vue from "vue";

export function reset<T extends Model>(
  propOffset?: keyof T & string
): MutationTree<T> {
  const offset = !propOffset ? ("all" as keyof T & string) : propOffset;
  return {
    reset(state: any, payload: any) {
      if (offset && Array.isArray(state[offset])) {
        Vue.set(state, offset, []);
      } else {
        state = {};
      }
    }
  };
}
