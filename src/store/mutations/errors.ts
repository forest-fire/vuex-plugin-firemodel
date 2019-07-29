import { MutationTree } from "vuex";
import { IFiremodelState } from "../../types/firemodel";

/**
 * The **mutations** associated to errors encountered during the
 * plugin's execution.
 */
export const errorMutations = <T>() =>
  ({
    error(state, err) {
      state.errors = state.errors ? state.errors.concat(err) : [err];
    }
  } as MutationTree<IFiremodelState<T>>);
