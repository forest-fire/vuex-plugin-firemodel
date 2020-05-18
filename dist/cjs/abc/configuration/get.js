"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = void 0;
const private_1 = require("../../private");
/**
 * Constructs a `AbcApi` object instance for the given `Model`
 */
function get(model, config = {}) {
    const api = new private_1.AbcApi(model, config);
    return api.get;
}
exports.get = get;
//# sourceMappingURL=get.js.map