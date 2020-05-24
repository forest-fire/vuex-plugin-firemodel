"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.firemodelActions = void 0;
const private_1 = require("../../private");
exports.firemodelActions = () => stripNamespaceFromKeys(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, private_1.errors()), private_1.authActions()), private_1.recordServerChanges()), private_1.recordLocal()), private_1.recordConfirms()), private_1.recordRollbacks()), private_1.watch()), private_1.relationship()), private_1.other()));
function stripNamespaceFromKeys(global) {
    const local = {};
    Object.keys(global).forEach(key => {
        local[key.replace("@firemodel/", "")] = global[key];
    });
    return local;
}
//# sourceMappingURL=firemodelActions.js.map