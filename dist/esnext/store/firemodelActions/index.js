import { record } from "./record";
import { watch } from "./watch";
import { relationship } from "./relationship";
export const firemodelActions = stripNamespaceFromKeys(Object.assign({}, record, watch, relationship));
function stripNamespaceFromKeys(global) {
    const local = {};
    Object.keys(global).forEach(key => {
        local[key.replace("@firemodel/", "")] = global[key];
    });
    return local;
}
