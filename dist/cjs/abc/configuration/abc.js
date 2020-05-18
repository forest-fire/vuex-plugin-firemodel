"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.abc = void 0;
const index_1 = require("../../index");
/**
 * Returns an array of **AbcApi** API's: `get`, `load`, and `watch`
 */
function abc(model, config = {}) {
    const api = new index_1.AbcApi(model, config);
    return [api.get.bind(api), api.load.bind(api), api.watch.bind(api)];
}
exports.abc = abc;
//# sourceMappingURL=abc.js.map