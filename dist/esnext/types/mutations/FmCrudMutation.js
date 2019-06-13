export var FmCrudMutation;
(function (FmCrudMutation) {
    // Client originated changes
    FmCrudMutation["changedLocally"] = "CHANGED_LOCALLY";
    FmCrudMutation["addedLocally"] = "ADDED_LOCALLY";
    FmCrudMutation["removedLocally"] = "REMOVED_LOCALLY";
    FmCrudMutation["relationshipAdded"] = "RELATIONSHIP_ADDED";
    FmCrudMutation["relationshipRemoved"] = "RELATIONSHIP_REMOVED";
    // Client originated changes CONFIRMED
    FmCrudMutation["serverAddConfirm"] = "ADD_CONFIRMATION";
    FmCrudMutation["serverChangeConfirm"] = "CHANGE_CONFIRMATION";
    FmCrudMutation["serverRemoveConfirm"] = "REMOVE_CONFIRMATION";
    // ROLLBACKS
    FmCrudMutation["serverAddRollback"] = "ROLLBACK_ADD";
    FmCrudMutation["serverChangeRollback"] = "ROLLBACK_CHANGE";
    FmCrudMutation["serverRemoveRollback"] = "ROLLBACK_REMOVE";
    // Server originated changes
    FmCrudMutation["serverAdd"] = "SERVER_ADD";
    FmCrudMutation["serverChange"] = "SERVER_CHANGE";
    FmCrudMutation["serverRemove"] = "SERVER_REMOVE";
})(FmCrudMutation || (FmCrudMutation = {}));
