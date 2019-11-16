export const other = () => ({
    async RESET({ commit }, module) {
        commit(`${module}/RESET`, { module });
    }
});
