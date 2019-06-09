"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firemodel_1 = require("firemodel");
const abstracted_client_1 = require("abstracted-client");
const common_types_1 = require("common-types");
const __1 = require("..");
/**
 * **actionsConfig**
 *
 * This plugin has two actions which it services: **config** and **crud**.
 * This defines the _config_ actions only. The configuration actions are
 * sort of what they say on the tin ... things which involve configuring
 * this plug.
 */
exports.actionsConfig = {
    /**
     * **connect**
     *
     * Connects to the Firebase database
     */
    async connect(store, config) {
        const { commit, dispatch, rootState } = store;
        commit("@firemodel/CONFIGURE" /* configure */, config); // set Firebase configuration
        try {
            const db = await abstracted_client_1.DB.connect(config);
            __1.setDb(db);
            firemodel_1.FireModel.defaultDb = db;
            commit("@firemodel/CONNECT" /* connect */);
            const ctx = {
                Record: firemodel_1.Record,
                List: firemodel_1.List,
                Watch: firemodel_1.Watch,
                db,
                dispatch,
                commit,
                state: rootState
            };
            await deQueue(ctx, "connected");
        }
        catch (e) {
            commit("@firemodel/CONNECTION_ERROR" /* connectionError */, e);
            throw common_types_1.createError(`firemodel-plugin/connection-error`, e.message);
        }
    },
    /**
     * **anonymousAuth**
     *
     * checks to see if already signed in to Firebase but if not
     * then signs into Firebase as an _anonymous_ user
     */
    async anonymousAuth(store) {
        const { commit, state, dispatch, rootState } = store;
        const db = await abstracted_client_1.DB.connect(state.config);
        const auth = await db.auth();
        let user;
        if (auth.currentUser) {
            user = {
                isAnonymous: auth.currentUser.isAnonymous,
                uid: auth.currentUser.uid,
                email: auth.currentUser.email,
                emailVerified: auth.currentUser.emailVerified
            };
        }
        else {
            const anon = await auth.signInAnonymously();
            user = {
                uid: anon.user.uid,
                isAnonymous: true,
                emailVerified: false
            };
        }
        commit("setCurrentUser", user);
        const ctx = Object.assign({ Watch: firemodel_1.Watch,
            Record: firemodel_1.Record,
            List: firemodel_1.List,
            db,
            dispatch,
            commit }, user, { state: rootState });
        await deQueue(ctx, "logged-in");
    },
    /**
     * **watchAuth**
     *
     * Watches Firebase auth events and sends notifications of changes
     * via `LOGGED_IN` and `LOGGED_OUT` mutations which in turn ensure
     * that the `@firemodel` state tree has an up-to-date representation
     * of the `currentUser`.
     *
     * Also enables the appropriate lifecycle hooks: `onLogOut` and `onLogIn`
     */
    async watchAuth(store) {
        const { commit, rootState, dispatch, state } = store;
        const baseContext = {
            List: firemodel_1.List,
            Record: firemodel_1.Record,
            Watch: firemodel_1.Watch,
            commit,
            dispatch,
            state: rootState
        };
        const authChanged = (user) => {
            if (user) {
                const fm = state["@firemodel"];
                if (state.currentUser && fm.currentUser.uid !== user.uid) {
                    if (state.currentUser)
                        commit("userChanged", { old: state.currentUser, new: user });
                    // deQueue(store, 'user-changed')
                }
                else if (!state.currentUser) {
                    commit("@firemodel/USER_LOGGED_IN" /* userLoggedIn */, user);
                    deQueue(Object.assign({}, baseContext, { uid: user.uid, isAnonymous: user.isAnonymous }), "logged-in");
                }
                commit("@firemodel/SET_CURRENT_USER" /* setCurrentUser */, {
                    isAnonymous: user.isAnonymous,
                    uid: user.uid,
                    email: user.email,
                    emailVerified: user.emailVerified
                });
            }
            else {
                commit("@firemodel/USER_LOGGED_OUT" /* userLoggedOut */);
                deQueue(Object.assign({}, baseContext, { uid: state.currentUser.uid, isAnonymous: state.currentUser.isAnonymous }), "logged-out");
            }
        };
    },
    /**
     * **watchRouteChanges**
     *
     * Enables lifecycle hooks for route changes
     */
    async watchRouteChanges({ dispatch, commit, rootState }) {
        if (__1.configuration.onRouteChange) {
            const ctx = {
                Watch: firemodel_1.Watch,
                Record: firemodel_1.Record,
                List: firemodel_1.List,
                dispatch,
                commit,
                state: rootState
            };
            deQueue(ctx, "route-changed");
        }
    }
};
/**
 * **deQueue**
 *
 * pulls items off the lifecycle queue which match the lifecycle event
 */
async function deQueue(ctx, lifecycle) {
    const remainingQueueItems = [];
    const queued = ctx.state["@firemodel"].queued.filter(i => i.on === lifecycle);
    for (const item of queued) {
        try {
            const { cb } = item;
            await cb(ctx);
        }
        catch (e) {
            console.error(`deQueing ${item.name}: ${e.message}`);
            ctx.commit("error", {
                message: e.message,
                code: e.code || e.name,
                stack: e.stack
            });
            remainingQueueItems.push(Object.assign({}, item, { error: e.message, errorStack: e.stack }));
        }
    }
    ctx.commit("@firemodel/LIFECYCLE_EVENT_COMPLETED" /* lifecycleEventCompleted */, {
        event: lifecycle,
        actionCallbacks: queued.filter(i => i.on === lifecycle).map(i => i.name)
    });
}
//# sourceMappingURL=actionsConfig.js.map