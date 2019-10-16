export var FmConfigMutation;
(function (FmConfigMutation) {
    FmConfigMutation["queueHook"] = "QUEUE_EVENT_HOOK";
    FmConfigMutation["queueWatcher"] = "QUEUE_WATCHER";
    /** the DB configuration */
    FmConfigMutation["configure"] = "CONFIGURE";
    /** starting the DB connection process */
    FmConfigMutation["connecting"] = "CONNECTING";
    /** the DB has been connected to */
    FmConfigMutation["connected"] = "CONNECTED";
    /** the DB has been disconnected from */
    FmConfigMutation["disconnected"] = "DISCONNECTED";
    /** there was a connection error while performing an operation */
    FmConfigMutation["connectionError"] = "CONNECTION_ERROR";
    /** there was an application error */
    FmConfigMutation["appErr"] = "APP_ERROR";
    /** clear the errors which were being stored locally */
    FmConfigMutation["clearErrors"] = "CLEAR_ERRORS";
    /** the "current user" has changed, user identity details have been set */
    FmConfigMutation["setCurrentUser"] = "SET_CURRENT_USER";
    /** a user has logged in */
    FmConfigMutation["userLoggedIn"] = "USER_LOGGED_IN";
    /** a user has logged out */
    FmConfigMutation["userLoggedOut"] = "USER_LOGGED_OUT";
    /** a lifecycle event's hooks have all fired */
    FmConfigMutation["lifecycleEventCompleted"] = "LIFECYCLE_EVENT_COMPLETED";
    /** all core plugin services have started */
    FmConfigMutation["coreServicesStarted"] = "CORE_SERVICES_STARTED";
    // watchers
    /** Firebase -- via Firemodel -- has been asked to watch a new path in DB */
    FmConfigMutation["watcherStarting"] = "WATCHER_STARTING";
    /** Firebase -- via Firemodel -- has started watching a new path in the DB */
    FmConfigMutation["watcherStarted"] = "WATCHER_STARTED";
    /**
     * When a "largePayload" has been declared, all SERVER_ADD events from the given
     * watcher are muted for a short period to ensure that Vuex is not bombarded with
     * a mutation for every record.
     */
    FmConfigMutation["watcherMuted"] = "WATCHER_MUTED";
    /**
     * Once the initial set of SERVER_ADD events, the watcher must be _un_muted to
     * the SERVER_ADD mutations.
     */
    FmConfigMutation["watcherUnmuted"] = "WATCHER_UNMUTED";
})(FmConfigMutation || (FmConfigMutation = {}));
