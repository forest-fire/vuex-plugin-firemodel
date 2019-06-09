export var FmConfigMutation;
(function (FmConfigMutation) {
    /** the DB configuration */
    FmConfigMutation["configure"] = "@firemodel/CONFIGURE";
    /** the DB has been connected to */
    FmConfigMutation["connect"] = "@firemodel/CONNECT";
    /** the DB has been disconnected from */
    FmConfigMutation["disconnect"] = "@firemodel/DISCONNECT";
    /** there was a connection error while performing an operation */
    FmConfigMutation["connectionError"] = "@firemodel/CONNECTION_ERROR";
    /** there was an application error */
    FmConfigMutation["appErr"] = "@firemodel/APP_ERROR";
    /** the "current user" has changed, user identity details have been set */
    FmConfigMutation["setCurrentUser"] = "@firemodel/SET_CURRENT_USER";
    /** a user has logged in */
    FmConfigMutation["userLoggedIn"] = "@firemodel/USER_LOGGED_IN";
    /** a user has logged out */
    FmConfigMutation["userLoggedOut"] = "@firemodel/USER_LOGGED_OUT";
    /** a lifecycle event's hooks have all fired */
    FmConfigMutation["lifecycleEventCompleted"] = "@firemodel/LIFECYCLE_EVENT_COMPLETED";
})(FmConfigMutation || (FmConfigMutation = {}));
