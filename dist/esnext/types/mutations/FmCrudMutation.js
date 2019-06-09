export var FmCrudMutation;
(function (FmCrudMutation) {
    // Client originated changes
    FmCrudMutation["changedLocally"] = "CHANGED_LOCALLY";
    FmCrudMutation["addedLocally"] = "ADDED_LOCALLY";
    FmCrudMutation["removedLocally"] = "REMOVED_LOCALLY";
    FmCrudMutation["serverConfirmed"] = "SERVER_CONFIRMED";
    FmCrudMutation["serverRollback"] = "SERVER_ROLLBACK";
    FmCrudMutation["relationshipAdded"] = "RELATIONSHIP_ADDED";
    FmCrudMutation["relationshipRemoved"] = "RELATIONSHIP_REMOVED";
    // Server originated changes
    FmCrudMutation["serverAdded"] = "SERVER_ADDED";
    FmCrudMutation["serverChanged"] = "SERVER_CHANGED";
    FmCrudMutation["serverRemoved"] = "SERVER_REMOVED";
})(FmCrudMutation || (FmCrudMutation = {}));
