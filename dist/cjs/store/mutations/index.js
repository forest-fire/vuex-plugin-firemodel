"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mutations = void 0;
const localConfig_1 = require("./localConfig");
const serverConfirm_1 = require("./serverConfirm");
const serverRollback_1 = require("./serverRollback");
const auth_1 = require("./auth");
const watcher_1 = require("./watcher");
const localCrud_1 = require("./localCrud");
const errors_1 = require("./errors");
const relationships_1 = require("./relationships");
/**
 * The **mutations** to the `@firemodel` state node; this state node will be off the
 * root of a state tree which is defined by the application but remains
 * unknown/generic to this plugin
 */
exports.mutations = () => (Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, errors_1.errorMutations()), localConfig_1.localConfig()), auth_1.authMutations()), serverConfirm_1.serverConfirm()), serverRollback_1.serverRollback()), localCrud_1.localCrud()), relationships_1.relationships()), watcher_1.watcher()));
//# sourceMappingURL=index.js.map