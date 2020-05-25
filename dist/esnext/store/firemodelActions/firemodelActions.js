import { authActions, errors, other, recordConfirms, recordLocal, recordRollbacks, recordServerChanges, relationship, watch } from "../../private";
export const firemodelActions = () => stripNamespaceFromKeys(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, errors()), authActions()), recordServerChanges()), recordLocal()), recordConfirms()), recordRollbacks()), watch()), relationship()), other()));
function stripNamespaceFromKeys(global) {
    const local = {};
    Object.keys(global).forEach(key => {
        local[key.replace("@firemodel/", "")] = global[key];
    });
    return local;
}
