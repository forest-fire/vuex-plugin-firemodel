import type { ICurrentUser, IFmLifecycleEvent, IFmQueuedAction, IFiremodelState } from '@/types';
import { User, UserCredential } from '@firebase/auth-types';

import { MutationTree } from 'vuex';
import Vue from 'vue';
import { FmConfigMutation } from '@/enums';

/**
 * The **mutations** scoped to the local configuration of Firebase
 */
export const localConfig = <T>() =>
  ({
    [FmConfigMutation.coreServicesStarted]: (state) => {
      //
    },
    [FmConfigMutation.configure]: (state, config) => {
      state.config = config;
    },
    [FmConfigMutation.connected](state) {
      state.status = 'connected';
    },
    [FmConfigMutation.connecting](state) {
      state.status = 'connecting';
    },
    [FmConfigMutation.connectionError](state, err: Error) {
      state.status = 'error';
      Vue.set(state, 'errors', state.errors ? state.errors.concat(err.message) : [err.message]);
    },
    [FmConfigMutation.appErr](state, err) {
      if (!state.errors) {
        Vue.set(state, 'errors', []);
      }
      Vue.set(state, 'errors', (state.errors as any[]).concat(err.message));
    },
    [FmConfigMutation.clearErrors](state) {
      Vue.set(state, 'errors', []);
    },

    [FmConfigMutation.userLoggedIn](state, user: ICurrentUser) {
      Vue.set(state, 'currentUser', user);

      Vue.set(state, 'authenticated', !user ? false : user.isAnonymous ? 'anonymous' : 'logged-in');
    },

    [FmConfigMutation.userLoggedOut](state, user: ICurrentUser) {
      Vue.set(state, 'currentUser', user);
      Vue.set(state, 'authenticated', false);
    },

    [FmConfigMutation.userUpgraded](state, payload) {
      // TODO: implement
    },

    [FmConfigMutation.userAbandoned](state, payload) {
      // TODO: implement
    },

    [FmConfigMutation.queueHook](state, item: IFmQueuedAction<T>) {
      Vue.set(state, 'queued', state.queued.concat(item));
    },

    [FmConfigMutation.queueWatcher](state, item: IFmQueuedAction<T>) {
      Vue.set(state, 'queued', state.queued.concat(item));
    },

    [FmConfigMutation.lifecycleEventCompleted](
      state,
      event: { event: IFmLifecycleEvent; actionCallbacks: string[] }
    ) {
      //
    },
  } as MutationTree<IFiremodelState<T>>);

function isUserCredential(user: User | UserCredential): user is UserCredential {
  return (user as UserCredential).credential ? true : false;
}
