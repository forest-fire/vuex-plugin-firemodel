import Vue from "vue";
/**
 * The **mutations** scoped to the local configuration of Firebase
 */
export const localConfig = () => ({
    ["CORE_SERVICES_STARTED" /* coreServicesStarted */]: state => {
        //
    },
    ["CONFIGURE" /* configure */]: (state, config) => {
        state.config = config;
    },
    ["CONNECTED" /* connected */](state) {
        state.status = "connected";
    },
    ["CONNECTING" /* connecting */](state) {
        state.status = "connecting";
    },
    ["CONNECTION_ERROR" /* connectionError */](state, err) {
        state.status = "error";
        Vue.set(state, "errors", state.errors ? state.errors.concat(err.message) : [err.message]);
    },
    ["APP_ERROR" /* appErr */](state, err) {
        if (!state.errors) {
            Vue.set(state, "errors", []);
        }
        Vue.set(state, "errors", state.errors.concat(err.message));
    },
    ["CLEAR_ERRORS" /* clearErrors */](state) {
        Vue.set(state, "errors", []);
    },
    ["USER_LOGGED_IN" /* userLoggedIn */](state, user) {
        state.currentUser = {
            uid: user.uid,
            isAnonymous: user.isAnonymous,
            email: user.email,
            emailVerified: user.emailVerified,
            fullProfile: user
        };
        Vue.set(state, "authenticated", !user ? false : user.isAnonymous ? "anonymous" : "logged-in");
    },
    ["USER_LOGGED_OUT" /* userLoggedOut */](state) {
        Vue.set(state, "currentUser", {});
        Vue.set(state, "authenticated", false);
    },
    ["QUEUE_EVENT_HOOK" /* queueHook */](state, item) {
        Vue.set(state, "queued", state.queued.concat(item));
    },
    ["QUEUE_WATCHER" /* queueWatcher */](state, item) {
        Vue.set(state, "queued", state.queued.concat(item));
    },
    ["LIFECYCLE_EVENT_COMPLETED" /* lifecycleEventCompleted */](state, event) {
        //
    }
});
