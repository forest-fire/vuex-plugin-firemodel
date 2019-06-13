export declare const enum FmCrudMutation {
    changedLocally = "CHANGED_LOCALLY",
    addedLocally = "ADDED_LOCALLY",
    removedLocally = "REMOVED_LOCALLY",
    relationshipAdded = "RELATIONSHIP_ADDED",
    relationshipRemoved = "RELATIONSHIP_REMOVED",
    serverAddConfirm = "ADD_CONFIRMATION",
    serverChangeConfirm = "CHANGE_CONFIRMATION",
    serverRemoveConfirm = "REMOVE_CONFIRMATION",
    serverAddRollback = "ROLLBACK_ADD",
    serverChangeRollback = "ROLLBACK_CHANGE",
    serverRemoveRollback = "ROLLBACK_REMOVE",
    serverAdd = "SERVER_ADD",
    serverChange = "SERVER_CHANGE",
    serverRemove = "SERVER_REMOVE"
}
