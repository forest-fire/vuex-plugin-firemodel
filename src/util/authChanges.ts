import {
  ICurrentUser,
  IFmAuthenticatatedContext,
  IFmLoginEventContext,
  IFmLogoutEventContext,
} from '@/types';

import { User } from '@firebase/auth-types';
import { getPluginConfig } from '@/util';
import { runQueue } from './runQueue';
import { FmConfigMutation } from '@/enums';

let _uid: string;
let _isAnonymous: boolean;

export const authChanged = <T>(context: IFmAuthenticatatedContext<T>) => async (
  user: User | null
) => {
  if (user) {
    if (!user.isAnonymous && _isAnonymous === true) {
      console.group('Starting "user-abandoned" event');
      console.log(`anonymous user ${_uid} was abandoned in favor of user ${user.uid}`);
      context.commit(FmConfigMutation.userAbandoned, {
        user: user,
        priorUid: _uid,
      });

      await runQueue(context, 'user-abandoned');
      console.groupEnd();
    }
    console.group('Login Event');
    console.info(`Login detected [uid: ${user.uid}, anonymous: ${user.isAnonymous}]`);

    context.commit(FmConfigMutation.userLoggedIn, extractUserInfo(user));

    console.log('Getting auth token');
    const token = await user.getIdTokenResult();
    context.commit('SET_AUTH_TOKEN', token);
    _uid = user.uid;
    _isAnonymous = user.isAnonymous;
    await runQueue(
      {
        ...context,
        isLoggedIn: true,
        isAnonymous: user.isAnonymous,
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
      } as IFmLoginEventContext<T>,
      'logged-in'
    );

    console.groupEnd();
  } else {
    console.group('Logout event');
    context.commit(FmConfigMutation.userLoggedOut, extractUserInfo(user));
    await runQueue(
      {
        ...context,
        isLoggedIn: false,
        isAnonymous: false,
        emailVerified: false,
      } as IFmLogoutEventContext<T>,
      'logged-out'
    );
    console.log('finished onLogout queue');

    const config = getPluginConfig();

    if (config?.auth && typeof config?.auth === 'object' && config?.auth.anonymous) {
      console.info('logging in as a anonymous user (momentarily)');
      // async but we don't need to wait for it
      context.auth.signInAnonymously();
    }

    console.groupEnd();
  }
};

/**
 * Extracts the odd shaped object we're getting back in place of a true
 * `User` object with something useful for putting into the @firemodel
 * Vuex module.
 */
function extractUserInfo(input: User | null): ICurrentUser {
  return input
    ? {
        uid: input.uid,
        isAnonymous: input.isAnonymous,
        isLoggedIn: true,
        displayName: input.displayName,
        email: input.email,
        emailVerified: input.emailVerified,
        phoneNumber: input.phoneNumber,
        photoUrl: input.photoURL,
        refreshToken: input.refreshToken,
        lastSignIn: input.metadata.lastSignInTime,
        createdAt: input.metadata.creationTime,
      }
    : {
        uid: '',
        isAnonymous: false,
        isLoggedIn: false,
        displayName: null,
        email: null,
        emailVerified: false,
        phoneNumber: null,
        photoUrl: null,
        refreshToken: '',
      };
}
