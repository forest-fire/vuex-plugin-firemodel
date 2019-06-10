export declare const enum FmConfigMutation {
    queueHook = "@firemodel/QUEUE_EVENT_HOOK",
    queueWatcher = "@firemodel/QUEUE_WATCHER",
    /** the DB configuration */
    configure = "CONFIGURE",
    /** starting the DB connection process */
    connecting = "CONNECTING",
    /** the DB has been connected to */
    connected = "CONNECTED",
    /** the DB has been disconnected from */
    disconnected = "DISCONNECTED",
    /** there was a connection error while performing an operation */
    connectionError = "CONNECTION_ERROR",
    /** there was an application error */
    appErr = "APP_ERROR",
    /** clear the errors which were being stored locally */
    clearErrors = "CLEAR_ERRORS",
    /** the "current user" has changed, user identity details have been set */
    setCurrentUser = "SET_CURRENT_USER",
    /** a user has logged in */
    userLoggedIn = "USER_LOGGED_IN",
    /** a user has logged out */
    userLoggedOut = "USER_LOGGED_OUT",
    /** a lifecycle event's hooks have all fired */
    lifecycleEventCompleted = "LIFECYCLE_EVENT_COMPLETED",
    /** all core plugin services have started */
    coreServicesStarted = "CORE_SERVICES_STARTED",
    /** Firebase -- via Firemodel -- has been asked to watch a new path in DB */
    watcherStarting = "WATCHER_STARTING",
    /** Firebase -- via Firemodel -- has started watching a new path in the DB */
    watcherStarted = "WATCHER_STARTED"
}
