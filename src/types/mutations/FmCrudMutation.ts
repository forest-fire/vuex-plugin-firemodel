export const enum FmCrudMutation {
  // Client originated changes
  changedLocally = "CHANGED_LOCALLY",
  addedLocally = "ADDED_LOCALLY",
  removedLocally = "REMOVED_LOCALLY",
  serverConfirmed = "SERVER_CONFIRMED",
  serverRollback = "SERVER_ROLLBACK",
  relationshipAdded = "RELATIONSHIP_ADDED",
  relationshipRemoved = "RELATIONSHIP_REMOVED",

  // Server originated changes
  serverAdded = "SERVER_ADDED",
  serverChanged = "SERVER_CHANGED",
  serverRemoved = "SERVER_REMOVED"
}
