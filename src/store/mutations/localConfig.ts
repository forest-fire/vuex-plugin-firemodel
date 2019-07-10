import { MutationTree } from "vuex";
import {
  IFiremodelState,
  IFmLifecycleEvents,
  IFmQueuedAction
} from "../../types";
import { FmConfigMutation } from "../../types/mutations/FmConfigMutation";
import { User } from "@firebase/auth-types";

/**
 * The **mutations** scoped to the local configuration of Firebase
 */
export const localConfig: MutationTree<IFiremodelState> = {
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
    state.errors = state.errors
      ? state.errors.concat(err.message)
      : [err.message];
  },
  [FmConfigMutation.appErr](state, err) {
    if (!state.errors) {
      state.errors = [];
    }
    state.errors.push(err.message);
  },
  [FmConfigMutation.clearErrors](state) {
    state.errors = [];
  },

  [FmConfigMutation.userLoggedIn](state, user: User) {
    state.currentUser = {
      uid: user.uid,
      isAnonymous: user.isAnonymous,
      email: user.email,
      emailVerified: user.emailVerified,
      fullProfile: user
    };
    state.authenticated = !user
      ? false
      : user.isAnonymous
      ? "anonymous"
      : "logged-in";
  },

  [FmConfigMutation.userLoggedOut](state) {
    state.currentUser = undefined;
    state.authenticated = false;
  },

  [FmConfigMutation.queueHook](state, item: IFmQueuedAction) {
    state.queued = state.queued.concat(item);
  },

  [FmConfigMutation.queueWatcher](state, item: IFmQueuedAction) {
    state.queued = state.queued.concat(item);
  },

  [FmConfigMutation.lifecycleEventCompleted](
    state,
    event: { event: IFmLifecycleEvents; actionCallbacks: string[] }
  ) {
    //
  }
};
