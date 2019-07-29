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
        state.errors = state.errors
            ? state.errors.concat(err.message)
            : [err.message];
    },
    ["APP_ERROR" /* appErr */](state, err) {
        if (!state.errors) {
            state.errors = [];
        }
        state.errors.push(err.message);
    },
    ["CLEAR_ERRORS" /* clearErrors */](state) {
        state.errors = [];
    },
    ["USER_LOGGED_IN" /* userLoggedIn */](state, user) {
        state.currentUser = {
            uid: user.uid,
            isAnonymous: user.isAnonymous,
            email: user.email,
            emailVerified: user.emailVerified,
            fullProfile: user
        };
        state.authenticated = !user
            ? false
            : user.isAnonymous
                ? "anonymous"
                : "logged-in";
    },
    ["USER_LOGGED_OUT" /* userLoggedOut */](state) {
        state.currentUser = undefined;
        state.authenticated = false;
    },
    ["QUEUE_EVENT_HOOK" /* queueHook */](state, item) {
        state.queued = state.queued.concat(item);
    },
    ["QUEUE_WATCHER" /* queueWatcher */](state, item) {
        state.queued = state.queued.concat(item);
    },
    ["LIFECYCLE_EVENT_COMPLETED" /* lifecycleEventCompleted */](state, event) {
        //
    }
});
