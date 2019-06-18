"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firemodel_1 = require("firemodel");
const abstracted_client_1 = require("abstracted-client");
const __1 = require("../..");
const FmConfigActions_1 = require("../../types/actions/FmConfigActions");
const FiremodelPluginError_1 = require("../../errors/FiremodelPluginError");
/**
 * **pluginActions**
 *
 * The core services that this plugin provides are exposed as Vuex actions
 */
exports.pluginActions = {
    /**
     * **connect**
     *
     * Connects to the Firebase database
     */
    async [FmConfigActions_1.FmConfigAction.connect](store, config) {
        const { commit, dispatch, rootState } = store;
        if (!config) {
            throw new FiremodelPluginError_1.FireModelPluginError(`Connecting to database but NO configuration was present!`, "not-allowed");
        }
        commit("CONFIGURE" /* configure */, config); // set Firebase configuration
        try {
            commit("CONNECTING" /* connecting */);
            const db = await abstracted_client_1.DB.connect(config);
            __1.setDb(db);
            firemodel_1.FireModel.defaultDb = db;
            commit("CONNECTED" /* connected */);
            const ctx = {
                Record: firemodel_1.Record,
                List: firemodel_1.List,
                Watch: firemodel_1.Watch,
                db,
                dispatch,
                commit,
                state: rootState
            };
            await runQueue(ctx, "connected");
        }
        catch (e) {
            commit("CONNECTION_ERROR" /* connectionError */, e);
            throw new FiremodelPluginError_1.FireModelPluginError(e.message, "connection-error");
        }
    },
    /**
     * **anonymousAuth**
     *
     * checks to see if already signed in to Firebase but if not
     * then signs into Firebase as an _anonymous_ user
     */
    async [FmConfigActions_1.FmConfigAction.anonymousLogin](store) {
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
        commit("USER_LOGGED_IN" /* userLoggedIn */, user);
        const ctx = Object.assign({ Watch: firemodel_1.Watch,
            Record: firemodel_1.Record,
            List: firemodel_1.List,
            db,
            dispatch,
            commit }, user, { state: rootState });
        await runQueue(ctx, "logged-in");
    },
    /**
     * **firebaseAuth**
     *
     * Watches Firebase Auth events and sends notifications of changes
     * via `LOGGED_IN` and `LOGGED_OUT` mutations which in turn ensure
     * that the `@firemodel` state tree has an up-to-date representation
     * of the `currentUser`.
     *
     * Also enables the appropriate lifecycle hooks: `onLogOut` and `onLogIn`
     */
    async [FmConfigActions_1.FmConfigAction.firebaseAuth](store) {
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
                // if (state.currentUser && fm.currentUser.uid !== user.uid) {
                //   if (state.currentUser)
                //     commit(FmConfigMutation.userLoggedIn, {
                //       old: state.currentUser,
                //       new: user
                //     });
                //   // deQueue(store, 'user-changed')
                // } else if (!state.currentUser) {
                //   commit(FmConfigMutation.userLoggedIn, user);
                //   deQueue(
                //     {
                //       ...baseContext,
                //       uid: user.uid,
                //       isAnonymous: user.isAnonymous
                //     } as IFmAuthEventContext,
                //     "logged-in"
                //   );
                // }
                commit("USER_LOGGED_IN" /* userLoggedIn */, {
                    isAnonymous: user.isAnonymous,
                    uid: user.uid,
                    email: user.email,
                    emailVerified: user.emailVerified
                });
            }
            else {
                commit("USER_LOGGED_OUT" /* userLoggedOut */);
                runQueue(Object.assign({}, baseContext, { uid: state.currentUser.uid, isAnonymous: state.currentUser.isAnonymous }), "logged-out");
            }
        };
    },
    /**
     * **watchRouteChanges**
     *
     * Enables lifecycle hooks for route changes
     */
    async [FmConfigActions_1.FmConfigAction.watchRouteChanges]({ dispatch, commit, rootState }) {
        if (__1.configuration.onRouteChange) {
            const ctx = {
                Watch: firemodel_1.Watch,
                Record: firemodel_1.Record,
                List: firemodel_1.List,
                dispatch,
                commit,
                state: rootState
            };
            runQueue(ctx, "route-changed");
        }
    }
};
/**
 * **runQueue**
 *
 * pulls items off the lifecycle queue which match the lifecycle event
 */
async function runQueue(ctx, lifecycle) {
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
    ctx.commit("LIFECYCLE_EVENT_COMPLETED" /* lifecycleEventCompleted */, {
        event: lifecycle,
        actionCallbacks: queued.filter(i => i.on === lifecycle).map(i => i.name)
    });
}
//# sourceMappingURL=pluginActions.js.map