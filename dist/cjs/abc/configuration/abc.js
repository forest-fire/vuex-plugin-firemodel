"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbcApi_1 = require("../api/AbcApi");
/**
 * Constructs a `AbcApi` object instance for the given `Model`
 */
function abc(model, config = {}) {
    const api = new AbcApi_1.AbcApi(model, config);
    return [api.get.bind(api), api.load.bind(api), api.watch.bind(api)];
}
exports.abc = abc;
//# sourceMappingURL=abc.js.map