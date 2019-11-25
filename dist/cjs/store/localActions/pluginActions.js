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
                db,
                config,
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
        const { commit, rootState } = store;
        const db = await database_1.database();
        const auth = await db.auth();
        if (auth.currentUser && !auth.currentUser.isAnonymous) {
            const anon = await auth.signInAnonymously();
            commit("ANONYMOUS_LOGIN", anon);
        }
    },
    /**
     * **firebaseAuth**
     *
     * Connects to the Firebase Auth API and then registers a callback for any auth
     * event (login/logout).
     *
     * Also enables the appropriate lifecycle hooks: `onLogOut`, `onLogIn`, and
     * `onUserUpgrade` (when anonymous user logs into a known user)
     */
    async [FmConfigActions_1.FmConfigAction.firebaseAuth](store, config) {
        const { commit, rootState, dispatch } = store;
        try {
            const db = await database_1.database();
            const auth = await db.auth();
            firemodel_1.FireModel.defaultDb = db;
            const ctx = {
                Watch: firemodel_1.Watch,
                Record: firemodel_1.Record,
                List: firemodel_1.List,
                auth,
                db,
                config,
                dispatch,
                commit,
                state: rootState
            };
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
    async [FmConfigActions_1.FmConfigAction.watchRouteChanges]({ dispatch, commit, rootState }, payload) {
        if (index_1.configuration.onRouteChange) {
            const ctx = {
                Watch: firemodel_1.Watch,
                Record: firemodel_1.Record,
                List: firemodel_1.List,
                dispatch,
                commit,
                state: rootState,
                leaving: payload.from.path,
                entering: payload.to.path,
                queryParams: payload.to.params
            };
            await runQueue_1.runQueue(ctx, "route-changed");
        }
    }
});
//# sourceMappingURL=pluginActions.js.map