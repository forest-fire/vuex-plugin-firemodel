import { FireModel, List, Record, Watch } from "firemodel";
import {
  FireModelPluginError,
  FmConfigAction,
  FmConfigMutation,
  IFiremodelConfig,
  IFmAuthenticatatedContext,
  IFmConnectedContext,
  IFmRouteEventContext,
  IVuexState,
  authChanged,
  database,
  getPluginConfig,
  runQueue
} from "../../private";

import { ActionTree } from "vuex";
import { FirebaseAuth } from "@forest-fire/types";

/**
 * **pluginActions**
 *
 * The core services that this plugin provides are exposed as Vuex actions
 */
export const pluginActions = <T>() =>
  ({
    /**
     * **connect**
     *
     * Connects to the Firebase database
     */
    async [FmConfigAction.connect](store, config) {
      const { commit, dispatch, rootState } = store;
      if (!config) {
        throw new FireModelPluginError(
          `Connecting to database but NO configuration was present!`,
          "not-allowed"
        );
      }
      try {
        const db = await database();
        FireModel.defaultDb = db;
        const ctx: IFmConnectedContext<T> = {
          Watch,
          Record,
          List,
          dispatch,
          commit,
          db,
          config,

          state: rootState as T & { "@firemodel": IVuexState<T> }
        };

        await runQueue(ctx, "connected");

        commit(FmConfigMutation.configure, config); // set Firebase configuration
      } catch (e) {
        throw new FireModelPluginError(
          `There was an issue connecting to the Firebase database: ${e.message}`,
          `vuex-plugin-firemodel/connection-problem`
        );
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
      const db = database();
      const auth = await db.auth() as FirebaseAuth;

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
    async [FmConfigAction.firebaseAuth](store, config: IFiremodelConfig<T>) {
      const { commit, rootState, dispatch } = store;

      try {
        const db = database();
        const auth = await db.auth() as FirebaseAuth;
        FireModel.defaultDb = db;

        const ctx: IFmAuthenticatatedContext<T> = {
          Watch,
          Record,
          List,
          auth,
          db,
          config,

          dispatch,
          commit,
          state: rootState as T & { "@firemodel": IVuexState<T> }
        };

        auth.onAuthStateChanged(authChanged(ctx));
        auth.setPersistence(
          typeof config.auth === "object"
            ? config.auth.persistence || "session"
            : "session"
        );
      } catch (e) {
        console.log("Problem hooking into onAuthStateChanged: ", e.message);
        console.log(e.stack);
      }
    },

    /**
     * **watchRouteChanges**
     *
     * Enables lifecycle hooks for route changes
     */
    async [FmConfigAction.watchRouteChanges](
      { dispatch, commit, rootState },
      payload
    ) {
      if (getPluginConfig().onRouteChange) {
        const ctx: IFmRouteEventContext<T> = {
          Watch,
          Record,
          List,

          dispatch,
          commit,
          state: rootState as T & { "@firemodel": IVuexState<T> },

          leaving: payload.from.path,
          entering: payload.to.path,
          queryParams: payload.to.params
        };
        await runQueue(ctx, "route-changed");
      }
    }
  } as ActionTree<IVuexState<T>, T>);
