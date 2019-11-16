export const other = () => ({
    /**
     * Resets a given module name back to it's default state
     */
    async RESET({ commit }, module) {
        commit(`${module}/RESET`, { module }, { root: true });
    }
});
