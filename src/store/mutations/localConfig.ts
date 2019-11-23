import { MutationTree } from "vuex";
import {
  IFiremodelState,
  IFmLifecycleEvents,
  IFmQueuedAction
} from "../../types";
import { FmConfigMutation } from "../../types/mutations/FmConfigMutation";
import { User } from "@firebase/auth-types";
import Vue from "vue";

/**
 * The **mutations** scoped to the local configuration of Firebase
 */
export const localConfig = <T>() =>
  ({
    [FmConfigMutation.coreServicesStarted]: state => {
      //
    },
    [FmConfigMutation.configure]: (state, config) => {
      state.config = config;
    },
    [FmConfigMutation.connected](state) {
      state.status = "connected";
    },
    [FmConfigMutation.connecting](state) {
      state.status = "connecting";
    },
    [FmConfigMutation.connectionError](state, err: Error) {
      state.status = "error";
      Vue.set(
        state,
        "errors",
        state.errors ? state.errors.concat(err.message) : [err.message]
      );
    },
    [FmConfigMutation.appErr](state, err) {
      if (!state.errors) {
        Vue.set(state, "errors", []);
      }
      Vue.set(state, "errors", (state.errors as any[]).concat(err.message));
    },
    [FmConfigMutation.clearErrors](state) {
      Vue.set(state, "errors", []);
    },

    [FmConfigMutation.userLoggedIn](state, user: User) {
      Vue.set(state, "currentUser", {
        uid: user.uid,
        isAnonymous: user.isAnonymous,
        email: user.email,
        emailVerified: user.emailVerified,
        fullProfile: user
      });

      Vue.set(
        state,
        "authenticated",
        !user ? false : user.isAnonymous ? "anonymous" : "logged-in"
      );
    },

    [FmConfigMutation.userLoggedOut](state) {
      Vue.set(state, "currentUser", {});
      Vue.set(state, "authenticated", false);
    },

    [FmConfigMutation.userUpgraded](state, payload) {
      // TODO: implement
    },

    [FmConfigMutation.userAbandoned](state, payload) {
      // TODO: implement
    },

    [FmConfigMutation.queueHook](state, item: IFmQueuedAction<T>) {
      Vue.set(state, "queued", state.queued.concat(item));
    },

    [FmConfigMutation.queueWatcher](state, item: IFmQueuedAction<T>) {
      Vue.set(state, "queued", state.queued.concat(item));
    },

    [FmConfigMutation.lifecycleEventCompleted](
      state,
      event: { event: IFmLifecycleEvents; actionCallbacks: string[] }
    ) {
      //
    }
  } as MutationTree<IFiremodelState<T>>);
