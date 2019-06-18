"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const localConfig_1 = require("./localConfig");
const serverConfirm_1 = require("./serverConfirm");
const watcher_1 = require("./watcher");
const localCrud_1 = require("./localCrud");
/**
 * The **mutations** to the `@firemodel` state node; this state node will be off the
 * root of a state tree which is defined by the application but remains
 * unknown/generic to this plugin
 */
exports.mutations = Object.assign({}, localConfig_1.localConfig, serverConfirm_1.serverConfirm, localCrud_1.localCrud, watcher_1.watcher);
//# sourceMappingURL=index.js.map