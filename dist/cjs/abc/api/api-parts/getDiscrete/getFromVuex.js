"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../../..");
const lodash_get_1 = __importDefault(require("lodash.get"));
async function getFromVuex(ctx) {
    const store = __1.getStore();
    const moduleIsList = ctx.about.config.isList;
    const data = lodash_get_1.default(store.state, ctx.vuex.fullPath.replace(/\//g, "."), []);
    return moduleIsList ? data : [data];
}
exports.getFromVuex = getFromVuex;
//# sourceMappingURL=getFromVuex.js.map