"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firemodel_1 = require("firemodel");
const index_1 = require("../../index");
const FmConfigActions_1 = require("../../types/actions/FmConfigActions");
const FiremodelPluginError_1 = require("../../errors/FiremodelPluginError");
const database_1 = require("../../shared/database");
/**
 * **pluginActions**
 *
 * The core services that this plugin provides are exposed as Vuex actions
 */
exports.pluginActions = () => ({
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
            const db = await database_1.database(config);
            if (!firemodel_1.FireModel.defaultDb) {
                firemodel_1.FireModel.defaultDb = db;
            }
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
        const db = await database_1.database();
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
        // const ctx: IFmAuthEventContext<T> = {
        //   Watch,
        //   Record,
        //   List,
        //   db,
        //   dispatch,
        //   commit,
        //   ...user,
        //   state: rootState
        // };
        // await runQueue(ctx, "logged-in");
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
    async [FmConfigActions_1.FmConfigAction.firebaseAuth](store, config) {
        const { commit, rootState, dispatch, state } = store;
        // const baseContext: Partial<IFmEventContext<T>> = {
        //   List,
        //   Record,
        //   Watch,
        //   commit,
        //   dispatch,
        //   state: rootState
        // };
        const authChanged = async (user) => {
            const ctx = {
                Watch: firemodel_1.Watch,
                Record: firemodel_1.Record,
                List: firemodel_1.List,
                dispatch,
                commit,
                isAnonymous: user ? user.isAnonymous : false,
                uid: user ? user.uid : "",
                emailVerified: user ? user.emailVerified : false,
                email: user ? user.email : "",
                state: rootState
            };
            if (user) {
                commit("USER_LOGGED_IN" /* userLoggedIn */, user);
                await runQueue(ctx, "logged-in");
            }
            else {
                commit("USER_LOGGED_OUT" /* userLoggedOut */, user);
                await runQueue(ctx, "logged-out");
            }
        };
        try {
            const db = await database_1.database();
            const auth = await db.auth();
            auth.onAuthStateChanged(authChanged);
        }
        catch (e) {
            console.log("Problem hooking into onAuthStateChanged: ", e.message);
            console.log(e.stack);
        }
    },
    /**
     * **watchRouteChanges**
     *
     * Enables lifecycle hooks for route changes
     */
    async [FmConfigActions_1.FmConfigAction.watchRouteChanges]({ dispatch, commit, rootState }) {
        if (index_1.configuration.onRouteChange) {
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
});
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