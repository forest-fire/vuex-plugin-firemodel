"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.state = void 0;
/**
 * The default state for this plugin's **Vuex** state node
 */
exports.state = () => ({
    authenticated: false,
    status: "unconfigured",
    queued: [],
    watching: [],
    localOnly: {},
    muted: []
});
//# sourceMappingURL=state.js.map