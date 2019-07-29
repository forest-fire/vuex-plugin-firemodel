export var FmCrudMutation;
(function (FmCrudMutation) {
    // Client originated changes
    FmCrudMutation["changedLocally"] = "CHANGED_LOCALLY";
    FmCrudMutation["addedLocally"] = "ADDED_LOCALLY";
    FmCrudMutation["removedLocally"] = "REMOVED_LOCALLY";
    FmCrudMutation["relationshipAddedLocally"] = "RELATIONSHIP_ADDED_LOCALLY";
    FmCrudMutation["relationshipRemovedLocally"] = "RELATIONSHIP_REMOVED_LOCALLY";
    FmCrudMutation["relationshipSetLocally"] = "RELATIONSHIP_SET_LOCALLY";
    FmCrudMutation["relationshipAddConfirmation"] = "RELATIONSHIP_ADDED_CONFIRMATION";
    FmCrudMutation["relationshipRemovedConfirmation"] = "RELATIONSHIP_REMOVED_CONFIRMATION";
    FmCrudMutation["relationshipSetConfirmation"] = "RELATIONSHIP_SET_CONFIRMATION";
    FmCrudMutation["relationshipAddRollback"] = "RELATIONSHIP_ADDED_ROLLBACK";
    FmCrudMutation["relationshipRemovedRollback"] = "RELATIONSHIP_REMOVED_ROLLBACK";
    FmCrudMutation["relationshipSetRollback"] = "RELATIONSHIP_SET_ROLLBACK";
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
