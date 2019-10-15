import { recordServerChanges } from "./recordServerChanges";
import { watch } from "./watch";
import { relationship } from "./relationship";
import { recordLocal } from "./recordLocal";
import { recordConfirms } from "./recordConfirms";
import { recordRollbacks } from "./recordRollbacks";
import { authActions } from "./auth";
import { errors } from "./errors";
export const firemodelActions = () => stripNamespaceFromKeys(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, errors()), authActions()), recordServerChanges()), recordLocal()), recordConfirms()), recordRollbacks()), watch()), relationship()));
function stripNamespaceFromKeys(global) {
    const local = {};
    Object.keys(global).forEach(key => {
        local[key.replace("@firemodel/", "")] = global[key];
    });
    return local;
}
