import { FireModel, Record, List, Watch } from "firemodel";
import { ActionTree } from "vuex";
import {
  IFiremodelState,
  IFmQueuedAction,
  IFmLifecycleEvents,
  IFmEventContext,
  IFmAuthEventContext,
  IFmUserInfo,
  IFiremodelConfig
} from "../../types/index";

import { User } from "@firebase/auth-types";
import { FmConfigMutation } from "../../types/mutations/FmConfigMutation";
import { configuration } from "../../index";
import { FmConfigAction } from "../../types/actions/FmConfigActions";
import { FireModelPluginError } from "../../errors/FiremodelPluginError";
import { database } from "../../shared/database";
import { IFirebaseConfig } from "abstracted-firebase/dist/esnext/types";

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

      commit(FmConfigMutation.configure, config); // set Firebase configuration
      try {
        commit(FmConfigMutation.connecting);
        const db = await database(config);

        if (!FireModel.defaultDb) {
          FireModel.defaultDb = db;
        }
        commit(FmConfigMutation.connected);
        const ctx: IFmEventContext<T> = {
          Record,
          List,
          Watch,
          db,
          dispatch,
          commit,
          state: rootState
        };
        await runQueue(ctx, "connected");
      } catch (e) {
        commit(FmConfigMutation.connectionError, e);
        throw new FireModelPluginError(e.message, "connection-error");
      }
    },

    /**
     * **anonymousAuth**
     *
     * checks to see if already signed in to Firebase but if not
     * then signs into Firebase as an _anonymous_ user
     */
    async [FmConfigAction.anonymousLogin](store) {
      const { commit, dispatch, rootState } = store;
      const db = await database();
      const auth = await db.auth();
      let user: IFmUserInfo;

      console.log(`checking anon login`, rootState);

      if (auth.currentUser) {
        user = {
          isAnonymous: auth.currentUser.isAnonymous,
          uid: auth.currentUser.uid,
          email: auth.currentUser.email,
          emailVerified: auth.currentUser.emailVerified
        };
      } else {
        const anon = await auth.signInAnonymously();
        user = {
          uid: (anon.user as User).uid,
          isAnonymous: true,
          emailVerified: false
        };
      }

      commit(FmConfigMutation.userLoggedIn, user);
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
    async [FmConfigAction.firebaseAuth](store, config: IFiremodelConfig<T>) {
      const { commit, rootState, dispatch } = store;

      const authChanged = async (user: User | null) => {
        const ctx: IFmAuthEventContext<T> = {
          Watch,
          Record,
          List,
          dispatch,
          commit,
          isAnonymous: user ? user.isAnonymous : false,
          uid: user ? user.uid : "",
          emailVerified: user ? user.emailVerified : false,
          email: user ? user.email : "",
          state: rootState
        };

        if (user) {
          console.info(`Login detected`, user);
          commit(FmConfigMutation.userLoggedIn, user);
          await runQueue(ctx, "logged-in");
        } else {
          console.info(`Logout detected`, user);
          commit(FmConfigMutation.userLoggedOut, user);
          await runQueue(ctx, "logged-out");
          if (config.anonymousAuth) {
            const auth = await (await database()).auth();
            const anon = await auth.signInAnonymously();
            const user = {
              uid: (anon.user as User).uid,
              isAnonymous: true,
              emailVerified: false
            };
            commit(FmConfigMutation.userLoggedIn, user);
          }
        }
      };
      try {
        const db = await database();
        const auth = await db.auth();
        auth.onAuthStateChanged(authChanged);
        auth.setPersistence(config.authPersistence || "session");
        console.log(
          `Auth state changes registered ${(rootState as any)["@firemodel"]}`
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
    async [FmConfigAction.watchRouteChanges]({ dispatch, commit, rootState }) {
      if (configuration.onRouteChange) {
        const ctx: IFmEventContext<T> = {
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
  } as ActionTree<IFiremodelState<T>, T>);

/**
 * **runQueue**
 *
 * pulls items off the lifecycle queue which match the lifecycle event
 */
async function runQueue<T>(
  ctx: IFmEventContext<T>,
  lifecycle: IFmLifecycleEvents
) {
  const remainingQueueItems: IFmQueuedAction<T>[] = [];
  const queued = ((ctx.state as any)["@firemodel"].queued as IFmQueuedAction<
    T
  >[]).filter(i => i.on === lifecycle);

  for (const item of queued) {
    try {
      const { cb } = item;
      await cb(ctx);
    } catch (e) {
      console.error(`deQueing ${item.name}: ${e.message}`);
      ctx.commit("error", {
        message: e.message,
        code: e.code || e.name,
        stack: e.stack
      });
      remainingQueueItems.push({
        ...item,
        ...{ error: e.message, errorStack: e.stack }
      });
    }
  }

  ctx.commit(FmConfigMutation.lifecycleEventCompleted, {
    event: lifecycle,
    actionCallbacks: queued.filter(i => i.on === lifecycle).map(i => i.name)
  });
}
