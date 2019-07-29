"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firemodel_1 = require("firemodel");
exports.watch = () => ({
    [firemodel_1.FmEvents.WATCHER_STARTING]({ commit }, payload) {
        commit("WATCHER_STARTING" /* watcherStarting */, payload);
    },
    [firemodel_1.FmEvents.WATCHER_STARTED]({ commit }, payload) {
        commit("WATCHER_STARTED" /* watcherStarted */, payload);
    }
});
//# sourceMappingURL=watch.js.map