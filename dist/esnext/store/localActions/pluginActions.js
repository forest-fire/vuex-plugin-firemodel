import { FireModel, Record, List, Watch } from "firemodel";
import { configuration } from "../../index";
import { FmConfigAction } from "../../types/actions/FmConfigActions";
import { FireModelPluginError } from "../../errors/FiremodelPluginError";
import { database } from "../../shared/database";
import { authChanged } from "../../shared/authChanges";
import { runQueue } from "../../shared/runQueue";
/**
 * **pluginActions**
 *
 * The core services that this plugin provides are exposed as Vuex actions
 */
export const pluginActions = () => ({
    /**
     * **connect**
     *
     * Connects to the Firebase database
     */
    async [FmConfigAction.connect](store, config) {
        const { commit, dispatch, rootState } = store;
        if (!config) {
            throw new FireModelPluginError(`Connecting to database but NO configuration was present!`, "not-allowed");
        }
        try {
            const db = await database(config);
            FireModel.defaultDb = db;
            const ctx = {
                Watch,
                Record,
                List,
                dispatch,
                commit,
                state: rootState
            };
            await runQueue(ctx, "connected");
            commit("CONFIGURE" /* configure */, config); // set Firebase configuration
        }
        catch (e) {
            throw new FireModelPluginError(`There was an issue connecting to the Firebase database: ${e.message}`, `vuex-plugin-firemodel/connection-problem`);
        }
    },
    /**
     * **anonymousAuth**
     *
     * checks to see if already signed in to Firebase but if not
     * then signs into Firebase as an _anonymous_ user
     */
    async [FmConfigAction.anonymousLogin](store) {
        const { commit, rootState } = store;
        const db = await database();
        const auth = await db.auth();
        let user;
        console.log(`checking anon login`, rootState);
        if (auth.currentUser && !auth.currentUser.isAnonymous) {
            const anon = await auth.signInAnonymously();
            commit("USER_LOGGED_IN" /* userLoggedIn */, {
                uid: anon.user.uid,
                isAnonymous: true,
                email: undefined,
                emailVerified: false,
                fullProfile: anon
            });
        }
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
    async [FmConfigAction.firebaseAuth](store, config) {
        const { commit, rootState, dispatch } = store;
        const ctx = {
            Watch,
            Record,
            List,
            dispatch,
            commit,
            config,
            state: rootState
        };
        try {
            const db = await database();
            const auth = await db.auth();
            auth.onAuthStateChanged(authChanged(ctx));
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
    async [FmConfigAction.watchRouteChanges]({ dispatch, commit, rootState }) {
        if (configuration.onRouteChange) {
            const ctx = {
                Watch,
                Record,
                List,
                dispatch,
                commit,
                state: rootState
            };
            await runQueue(ctx, "route-changed");
        }
    }
});
