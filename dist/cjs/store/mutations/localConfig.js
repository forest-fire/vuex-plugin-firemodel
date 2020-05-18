"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.localConfig = void 0;
const vue_1 = __importDefault(require("vue"));
/**
 * The **mutations** scoped to the local configuration of Firebase
 */
exports.localConfig = () => ({
    ["CORE_SERVICES_STARTED" /* coreServicesStarted */]: state => {
        //
    },
    ["CONFIGURE" /* configure */]: (state, config) => {
        state.config = config;
    },
    ["CONNECTED" /* connected */](state) {
        state.status = "connected";
    },
    ["CONNECTING" /* connecting */](state) {
        state.status = "connecting";
    },
    ["CONNECTION_ERROR" /* connectionError */](state, err) {
        state.status = "error";
        vue_1.default.set(state, "errors", state.errors ? state.errors.concat(err.message) : [err.message]);
    },
    ["APP_ERROR" /* appErr */](state, err) {
        if (!state.errors) {
            vue_1.default.set(state, "errors", []);
        }
        vue_1.default.set(state, "errors", state.errors.concat(err.message));
    },
    ["CLEAR_ERRORS" /* clearErrors */](state) {
        vue_1.default.set(state, "errors", []);
    },
    ["USER_LOGGED_IN" /* userLoggedIn */](state, user) {
        vue_1.default.set(state, "currentUser", user);
        vue_1.default.set(state, "authenticated", !user ? false : user.isAnonymous ? "anonymous" : "logged-in");
    },
    ["USER_LOGGED_OUT" /* userLoggedOut */](state, user) {
        vue_1.default.set(state, "currentUser", user);
        vue_1.default.set(state, "authenticated", false);
    },
    ["USER_UPGRADED" /* userUpgraded */](state, payload) {
        // TODO: implement
    },
    ["USER_ABANDONED" /* userAbandoned */](state, payload) {
        // TODO: implement
    },
    ["QUEUE_EVENT_HOOK" /* queueHook */](state, item) {
        vue_1.default.set(state, "queued", state.queued.concat(item));
    },
    ["QUEUE_WATCHER" /* queueWatcher */](state, item) {
        vue_1.default.set(state, "queued", state.queued.concat(item));
    },
    ["LIFECYCLE_EVENT_COMPLETED" /* lifecycleEventCompleted */](state, event) {
        //
    }
});
function isUserCredential(user) {
    return user.credential ? true : false;
}
//# sourceMappingURL=localConfig.js.map