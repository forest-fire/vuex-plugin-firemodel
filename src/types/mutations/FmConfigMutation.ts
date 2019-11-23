export const enum FmConfigMutation {
  queueHook = "QUEUE_EVENT_HOOK",
  queueWatcher = "QUEUE_WATCHER",
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
  /** a user who was previously an "anonymous" user was _upgraded_ to a **known** user */
  userUpgraded = "USER_UPGRADED",
  /** an anonymous user was abaandoned in favor of a logged in user */
  userAbandoned = "USER_ABANDONED",
  /** a user has logged out */
  userLoggedOut = "USER_LOGGED_OUT",
  /** a lifecycle event's hooks have all fired */
  lifecycleEventCompleted = "LIFECYCLE_EVENT_COMPLETED",
  /** all core plugin services have started */
  coreServicesStarted = "CORE_SERVICES_STARTED",

  // watchers

  /** Firebase -- via Firemodel -- has been asked to watch a new path in DB */
  watcherStarting = "WATCHER_STARTING",
  /** Firebase -- via Firemodel -- has started watching a new path in the DB */
  watcherStarted = "WATCHER_STARTED",
  /** When attempting to start a watcher there was a failure (usually permission based) */
  watcherFailed = "WATCHER_FAILED",
  /** Firebase -- via Firemodel -- has stopped watching a new path in the DB */
  watcherStopped = "WATCHER_STOPPED",
  //** All Firebase watchers have been stopped */
  watcherAllStopped = "WATCHER_STOPPED_ALL",
  /**
   * When a "largePayload" has been declared, all SERVER_ADD events from the given
   * watcher are muted for a short period to ensure that Vuex is not bombarded with
   * a mutation for every record.
   */
  watcherMuted = "WATCHER_MUTED",
  /**
   * Once the initial set of SERVER_ADD events, the watcher must be _un_muted to
   * the SERVER_ADD mutations.
   */
  watcherUnmuted = "WATCHER_UNMUTED"
}
