export const other = () => ({
    async reset({ commit }, module) {
        commit(`${module}/reset`, { module });
    }
});
