import { recordServerChanges } from "./recordServerChanges";
import { watch } from "./watch";
import { relationship } from "./relationship";
import { recordLocal } from "./recordLocal";
import { recordConfirms } from "./recordConfirms";
import { recordRollbacks } from "./recordRollbacks";
export const firemodelActions = stripNamespaceFromKeys(Object.assign({}, recordServerChanges, recordLocal, recordConfirms, recordRollbacks, watch, relationship));
function stripNamespaceFromKeys(global) {
    const local = {};
    Object.keys(global).forEach(key => {
        local[key.replace("@firemodel/", "")] = global[key];
    });
    return local;
}
