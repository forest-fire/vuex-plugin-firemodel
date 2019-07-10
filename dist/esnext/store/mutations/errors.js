/**
 * The **mutations** associated to errors encountered during the
 * plugin's execution.
 */
export const errorMutations = {
    error(state, err) {
        state.errors = state.errors ? state.errors.concat(err) : [err];
    }
};
