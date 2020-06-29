"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFromVuex = void 0;
const private_1 = require("../../../../private");
const index_1 = require("../../../../shared/index");
async function getFromVuex(ctx) {
    const store = private_1.getStore();
    const moduleIsList = ctx.about.config.isList;
    const data = index_1.get(store.state, ctx.vuex.fullPath.replace(/\//g, "."), []);
    return moduleIsList ? data : [data];
}
exports.getFromVuex = getFromVuex;
//# sourceMappingURL=getFromVuex.js.map