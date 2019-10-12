"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * converts a namespaced mutation or action to a localized one
 */
function localizeName(name) {
    return name.replace("@firemodel/", "");
}
exports.localizeName = localizeName;
//# sourceMappingURL=localizeName.js.map