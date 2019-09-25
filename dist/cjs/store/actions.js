"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./firemodelActions/index");
const pluginActions_1 = require("./localActions/pluginActions");
exports.actions = () => (Object.assign(Object.assign({}, index_1.firemodelActions()), pluginActions_1.pluginActions()));
//# sourceMappingURL=actions.js.map