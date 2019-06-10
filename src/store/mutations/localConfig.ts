import { IFirebaseConfig } from "abstracted-firebase/dist/esnext/types";
import { MutationTree } from "vuex";
import { IGenericStateTree } from "../..";
import {
  IFiremodelState,
  IFmWatchItem,
  IFmLifecycleEvents,
  IFmQueuedAction
} from "../../types";
import { IFmRecordEvent } from "firemodel";
import { FmConfigMutation } from "../../types/mutations/FmConfigMutation";
import { FmCrudMutation } from "../../types/mutations/FmCrudMutation";

/**
 * The **mutations** scoped to the local configuration of Firebase
 */
export const local: MutationTree<IFiremodelState> = {
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
    state.errors = state.errors ? state.errors.concat(err.message) : [err.message];
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

  [FmConfigMutation.userLoggedIn](state, user) {
    state.currentUser = {
      uid: user.uid,
      isAnonymous: user.isAnonymous,
      email: user.email,
      emailVerified: user.emailVerified
    };
    state.authenticated = !user ? false : user.isAnonymous ? "anonymous" : "logged-in";
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
