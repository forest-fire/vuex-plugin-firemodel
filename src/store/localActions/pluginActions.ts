import { FireModel, Record, List, Watch } from "firemodel";
import { DB } from "abstracted-client";
import { ActionTree } from "vuex";
import {
  IFiremodelState,
  IFmQueuedAction,
  IFmLifecycleEvents,
  IFmEventContext,
  IFmAuthEventContext,
  IFmUserInfo
} from "../../types";
import { IFirebaseClientConfig } from "abstracted-firebase";
import { User } from "@firebase/auth-types";
import { FmConfigMutation } from "../../types/mutations/FmConfigMutation";
import { IGenericStateTree, setDb, configuration } from "../..";
import { FmConfigAction } from "../../types/actions/FmConfigActions";
import { FireModelPluginError } from "../../errors/FiremodelPluginError";
import { database } from "../../shared/database";

/**
 * **pluginActions**
 *
 * The core services that this plugin provides are exposed as Vuex actions
 */
export const pluginActions = {
  /**
   * **connect**
   *
   * Connects to the Firebase database
   */
  async [FmConfigAction.connect](store, config: IFirebaseClientConfig) {
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
      setDb(db);
      FireModel.defaultDb = db;
      commit(FmConfigMutation.connected);
      const ctx: IFmEventContext = {
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
    const { commit, state, dispatch, rootState } = store;
    const db = await database(state.config);
    const auth = await db.auth();
    let user: IFmUserInfo;

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

    const ctx: IFmAuthEventContext = {
      Watch,
      Record,
      List,
      db,
      dispatch,
      commit,
      ...user,
      state: rootState
    };
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
  async [FmConfigAction.firebaseAuth](store) {
    const { commit, rootState, dispatch, state } = store;
    const baseContext: Partial<IFmEventContext> = {
      List,
      Record,
      Watch,
      commit,
      dispatch,
      state: rootState
    };
    const authChanged = (user?: User) => {
      if (user) {
        const fm: IFiremodelState = (state as any)["@firemodel"];
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
        commit(FmConfigMutation.userLoggedIn, {
          isAnonymous: user.isAnonymous,
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified
        });
      } else {
        commit(FmConfigMutation.userLoggedOut);
        runQueue(
          {
            ...baseContext,
            uid: state.currentUser.uid,
            isAnonymous: state.currentUser.isAnonymous
          } as IFmAuthEventContext,
          "logged-out"
        );
      }
    };
  },

  /**
   * **watchRouteChanges**
   *
   * Enables lifecycle hooks for route changes
   */
  async [FmConfigAction.watchRouteChanges]({ dispatch, commit, rootState }) {
    if (configuration.onRouteChange) {
      const ctx: IFmEventContext = {
        Watch,
        Record,
        List,
        dispatch,
        commit,
        state: rootState
      };
      runQueue(ctx, "route-changed");
    }
  }
} as ActionTree<IFiremodelState, IGenericStateTree>;

/**
 * **runQueue**
 *
 * pulls items off the lifecycle queue which match the lifecycle event
 */
async function runQueue<T extends IFmEventContext>(
  ctx: T,
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
