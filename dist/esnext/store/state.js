/**
 * The default state for this plugin's **Vuex** state node
 */
export const state = () => ({
    authenticated: false,
    status: "unconfigured",
    queued: [],
    watching: [],
    localOnly: []
});
