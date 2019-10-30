"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firemodel_1 = require("firemodel");
const index_1 = require("../../index");
const FmConfigActions_1 = require("../../types/actions/FmConfigActions");
const FiremodelPluginError_1 = require("../../errors/FiremodelPluginError");
const database_1 = require("../../shared/database");
const authChanges_1 = require("../../shared/authChanges");
const runQueue_1 = require("../../shared/runQueue");
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
        try {
            const db = await database_1.database(config);
            firemodel_1.FireModel.defaultDb = db;
            const ctx = {
                Watch: firemodel_1.Watch,
                Record: firemodel_1.Record,
                List: firemodel_1.List,
                dispatch,
                commit,
                state: rootState
            };
            await runQueue_1.runQueue(ctx, "connected");
            commit("CONFIGURE" /* configure */, config); // set Firebase configuration
        }
        catch (e) {
            throw new FiremodelPluginError_1.FireModelPluginError(`There was an issue connecting to the Firebase database: ${e.message}`, `vuex-plugin-firemodel/connection-problem`);
        }
    },
    /**
     * **anonymousAuth**
     *
     * checks to see if already signed in to Firebase but if not
     * then signs into Firebase as an _anonymous_ user
     */
    async [FmConfigActions_1.FmConfigAction.anonymousLogin](store) {
        const { commit, dispatch, rootState } = store;
        const db = await database_1.database();
        const auth = await db.auth();
        let user;
        console.log(`checking anon login`, rootState);
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
    },
    /**
     * **firebaseAuth**
     *
     * Watches Firebase Auth events and sends notifications of changes
     * via `LOGGED_IN` and `LOGGED_OUT` mutations which in turn ensure
     * that the `@firemodel` state tree has an up-to-date representation
     * of the `currentUser`.
     *
     * Also enables the appropriate lifecycle hooks: `onLogOut`, `onLogIn`, and
     * `onUserUpgrade` (when anonymous user logs into a known user)
     */
    async [FmConfigActions_1.FmConfigAction.firebaseAuth](store, config) {
        const { commit, rootState, dispatch } = store;
        const ctx = {
            Watch: firemodel_1.Watch,
            Record: firemodel_1.Record,
            List: firemodel_1.List,
            dispatch,
            commit,
            config,
            state: rootState
        };
        try {
            const db = await database_1.database();
            const auth = await db.auth();
            auth.onAuthStateChanged(authChanges_1.authChanged(ctx));
            auth.setPersistence(config.authPersistence || "session");
            console.log(`Auth state callback registered`, rootState["@firemodel"]);
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
            await runQueue_1.runQueue(ctx, "route-changed");
        }
    }
});
//# sourceMappingURL=pluginActions.js.map