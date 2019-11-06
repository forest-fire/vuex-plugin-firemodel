export const enum FmCrudMutation {
  // Client originated changes
  changedLocally = "CHANGED_LOCALLY",
  addedLocally = "ADDED_LOCALLY",
  removedLocally = "REMOVED_LOCALLY",

  relationshipAddedLocally = "RELATIONSHIP_ADDED_LOCALLY",
  relationshipRemovedLocally = "RELATIONSHIP_REMOVED_LOCALLY",
  relationshipSetLocally = "RELATIONSHIP_SET_LOCALLY",

  relationshipAddConfirmation = "RELATIONSHIP_ADDED_CONFIRMATION",
  relationshipRemovedConfirmation = "RELATIONSHIP_REMOVED_CONFIRMATION",
  relationshipSetConfirmation = "RELATIONSHIP_SET_CONFIRMATION",

  relationshipAddRollback = "RELATIONSHIP_ADDED_ROLLBACK",
  relationshipRemovedRollback = "RELATIONSHIP_REMOVED_ROLLBACK",
  relationshipSetRollback = "RELATIONSHIP_SET_ROLLBACK",

  // Client originated changes CONFIRMED
  serverAddConfirm = "ADD_CONFIRMATION",
  serverChangeConfirm = "CHANGE_CONFIRMATION",
  serverRemoveConfirm = "REMOVE_CONFIRMATION",
  // ROLLBACKS
  serverAddRollback = "ROLLBACK_ADD",
  serverChangeRollback = "ROLLBACK_CHANGE",
  serverRemoveRollback = "ROLLBACK_REMOVE",

  // Server originated changes
  serverAdd = "SERVER_ADD",
  serverChange = "SERVER_CHANGE",
  serverRemove = "SERVER_REMOVE",
  /**
   * when a watcher -- which was configured with `largePayload` -- starts,
   * it first sends an array of values that exist on the server so that the
   * server and client are in _sync_.
   */
  serverStateSync = "SERVER_STATE_SYNC",

  /**
   * Allows state modules to be "reset" which involves removing the data
   * in the given module.
   */
  reset = "RESET"
}
