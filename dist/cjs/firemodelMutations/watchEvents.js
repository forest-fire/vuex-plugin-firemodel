"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchEvents = void 0;
const shared_1 = require("../shared");
const vue_1 = __importDefault(require("vue"));
function watchEvents(propOffset) {
    const offset = !propOffset ? "all" : propOffset;
    return {
        /**
         * Bring in the server's current state at the point that a
         * watcher has been setup.
         */
        ["SERVER_STATE_SYNC" /* serverStateSync */](state, payload) {
            if (shared_1.isRecord(state, payload)) {
                shared_1.changeRoot(state, payload.value, payload.localPath);
            }
            else {
                vue_1.default.set(state, offset, payload.value);
            }
        }
    };
}
exports.watchEvents = watchEvents;
//# sourceMappingURL=watchEvents.js.map