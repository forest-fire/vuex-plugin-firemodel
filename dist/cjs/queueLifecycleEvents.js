"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queueLifecycleEvents = void 0;
const private_1 = require("./private");
const shared_1 = require("./shared");
async function queueLifecycleEvents(store, config) {
    if (!config) {
        throw new private_1.FireModelPluginError(`There was no configuration sent into the FiremodelPlugin!`, "not-allowed");
        return;
    }
    const iterable = [
        ["onConnect", "connected"],
        ["onAuth", "auth-event"],
        ["onLogin", "logged-in"],
        ["onLogout", "logged-out"],
        ["onDisconnect", "disconnected"],
        ["onRouteChange", "route-changed"],
        ["onUserUpgraded", "user-upgraded"]
    ];
    for (const i of iterable) {
        const [name, event] = i;
        if (config[name]) {
            const cb = config[name];
            store.commit(shared_1.addNamespace("QUEUE_EVENT_HOOK" /* queueHook */), {
                on: event,
                name: `lifecycle-event-${event}`,
                cb
            });
        }
    }
}
exports.queueLifecycleEvents = queueLifecycleEvents;
//# sourceMappingURL=queueLifecycleEvents.js.map