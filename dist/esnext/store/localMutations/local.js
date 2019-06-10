/**
 * The **mutations** scoped to the local configuration of Firebase
 */
export const local = {
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
        state.errors = state.errors ? state.errors.concat(err.message) : [err.message];
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
            emailVerified: user.emailVerified
        };
        state.authenticated = !user ? false : user.isAnonymous ? "anonymous" : "logged-in";
    },
    ["USER_LOGGED_OUT" /* userLoggedOut */](state) {
        state.currentUser = undefined;
        state.authenticated = false;
    },
    ["@firemodel/QUEUE_EVENT_HOOK" /* queueHook */](state, item) {
        state.queued = state.queued.concat(item);
    },
    ["@firemodel/QUEUE_WATCHER" /* queueWatcher */](state, item) {
        state.queued = state.queued.concat(item);
    },
    ["LIFECYCLE_EVENT_COMPLETED" /* lifecycleEventCompleted */](state, event) {
        //
    },
    ["ADDED_LOCALLY" /* addedLocally */](state, payload) {
        const p = payload;
        state.localOnly = state.localOnly.concat({
            action: "add",
            dbPath: p.dbPath,
            localPath: p.localPath,
            value: p.value,
            priorValue: p.priorValue,
            timestamp: new Date().getTime()
        });
    },
    ["CHANGED_LOCALLY" /* changedLocally */](state, payload) {
        const p = payload;
        state.localOnly = state.localOnly.concat({
            action: "update",
            dbPath: p.dbPath,
            localPath: p.localPath,
            value: p.value,
            priorValue: p.priorValue,
            timestamp: new Date().getTime()
        });
    },
    ["SERVER_ADD_CONFIRMATION" /* serverAddConfirm */](state, payload) {
        state.localOnly = state.localOnly.filter(i => i.dbPath !== payload.dbPath);
    },
    ["SERVER_CHANGE_CONFIRMATION" /* serverChangeConfirm */](state, payload) {
        state.localOnly = state.localOnly.filter(i => i.dbPath !== payload.dbPath);
    },
    ["SERVER_REMOVE_CONFIRMATION" /* serverRemoveConfirm */](state, payload) {
        state.localOnly = state.localOnly.filter(i => i.dbPath !== payload.dbPath);
    },
    ["WATCHER_STARTING" /* watcherStarting */](state, payload) {
        //
    },
    ["WATCHER_STARTED" /* watcherStarted */](state, payload) {
        state.watching = state.watching.concat(payload);
    }
};
