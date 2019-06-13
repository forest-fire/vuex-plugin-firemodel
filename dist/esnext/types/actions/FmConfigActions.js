export var FmConfigAction;
(function (FmConfigAction) {
    FmConfigAction["connect"] = "CONNECT";
    FmConfigAction["firebaseAuth"] = "FIREBASE_AUTH";
    FmConfigAction["anonymousLogin"] = "ANONYMOUS_LOGIN";
    FmConfigAction["watchRouteChanges"] = "WATCH_ROUTE_CHANGES";
    FmConfigAction["routeChanged"] = "CALL_ROUTE_HOOKS";
    FmConfigAction["watcherStarting"] = "WATCHER_STARTING";
})(FmConfigAction || (FmConfigAction = {}));
