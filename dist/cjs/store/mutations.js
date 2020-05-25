"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mutations = void 0;
const private_1 = require("../private");
/**
 * The **mutations** to the `@firemodel` state node; this state node will be off the
 * root of a state tree which is defined by the application but remains
 * unknown/generic to this plugin
 */
exports.mutations = () => (Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, private_1.errorMutations()), private_1.localConfig()), private_1.authMutations()), private_1.serverConfirm()), private_1.serverRollback()), private_1.localCrud()), private_1.relationships()), private_1.watcher()));
//# sourceMappingURL=mutations.js.map