"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbcApi_1 = require("../api/AbcApi");
/**
 * Constructs a `AbcApi` object instance for the given `Model`
 */
function get(model, config = {}) {
    const api = new AbcApi_1.AbcApi(model, config);
    return api.get;
}
exports.get = get;
//# sourceMappingURL=get.js.map