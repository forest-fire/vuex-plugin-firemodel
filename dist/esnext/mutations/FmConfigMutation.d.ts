export declare const enum FmConfigMutation {
    /** the DB configuration */
    configure = "@firemodel/CONFIGURE",
    /** the DB has been connected to */
    connect = "@firemodel/CONNECT",
    /** the DB has been disconnected from */
    disconnect = "@firemodel/DISCONNECT",
    /** there was a connection error while performing an operation */
    connectionError = "@firemodel/CONNECTION_ERROR",
    /** there was an application error */
    appErr = "@firemodel/APP_ERROR",
    /** the "current user" has changed, user identity details have been set */
    setCurrentUser = "@firemodel/SET_CURRENT_USER",
    /** a user has logged in */
    userLoggedIn = "@firemodel/USER_LOGGED_IN",
    /** a user has logged out */
    userLoggedOut = "@firemodel/USER_LOGGED_OUT",
    /** a lifecycle event's hooks have all fired */
    lifecycleEventCompleted = "@firemodel/LIFECYCLE_EVENT_COMPLETED"
}
