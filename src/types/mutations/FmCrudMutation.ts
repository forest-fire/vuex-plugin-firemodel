export const enum FmCrudMutation {
  // Client originated changes
  changedLocally = "CHANGED_LOCALLY",
  addedLocally = "ADDED_LOCALLY",
  removedLocally = "REMOVED_LOCALLY",

  relationshipAdded = "RELATIONSHIP_ADDED",
  relationshipRemoved = "RELATIONSHIP_REMOVED",

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
  serverRemove = "SERVER_REMOVE"
}
