import { FireModel, Record, List, Watch } from 'firemodel'
import { DB } from 'abstracted-client'
import { ActionTree } from 'vuex'
import {
  IFiremodelState,
  IFmQueuedAction,
  IFmLifecycleEvents,
  IFmEventContext,
  IFmAuthEventContext,
  IFmUserInfo,
  IFmLoginUpgradeEventContext,\
} from './types'
import { IRootState } from '.'
import { createError } from 'common-types'
import { IFirebaseConfig } from 'abstracted-firebase'
import { configuration, setDb } from './firemodel'
import { User } from '@firebase/auth-types'

/**
 * The actions which help to configure and setup
 * the Firemodel Plugin
 */
export default {
  async connect(store, config: IFirebaseConfig) {
    const { commit, dispatch, rootState } = store
    commit('configure', config) // set Firebase configuration
    commit('connecting')
    try {
      const db = await DB.connect(config)
      setDb(db)
      FireModel.defaultDb = db
      commit('connected')
      const ctx: IFmEventContext = {
        Record,
        List,
        Watch,
        db,
        dispatch,
        commit,
        state: rootState,
      }
      await deQueue(ctx, 'connected')
    } catch (e) {
      commit('connectionError', e)
      throw createError(`@firemodel/connection-error`, e.message)
    }
  },

  async passiveAuth(store) {
    const { commit, state, dispatch, rootState } = store
    const db = await DB.connect(state.config)
    const auth = await db.auth()
    let user: IFmUserInfo

    if (auth.currentUser) {
      user = {
        isAnonymous: auth.currentUser.isAnonymous,
        uid: auth.currentUser.uid,
        email: auth.currentUser.email,
        emailVerified: auth.currentUser.emailVerified,
      }
    } else {
      const anon = await auth.signInAnonymously()
      user = {
        uid: (anon.user as User).uid,
        isAnonymous: true,
        emailVerified: false,
      }
    }

    commit('setCurrentUser', user)

    const ctx: IFmAuthEventContext = {
      Watch,
      Record,
      List,
      db,
      dispatch,
      commit,
      ...user,
      state: rootState,
    }
    await deQueue(ctx, 'logged-in')
  },

  async watchAuth(store) {
    const { commit, rootState, dispatch, state } = store
    const baseContext: Partial<IFmEventContext> = {
      List,
      Record,
      Watch,
      commit,
      dispatch,
      state: rootState,
    }
    const authChanged = (user?: User) => {
      if (user) {
        const fm: IFiremodelState = (state as any)['@firemodel']
        if (state.currentUser && fm.currentUser.uid !== user.uid) {
          if (state.currentUser) commit('userChanged', { old: state.currentUser, new: user })
          // deQueue(store, 'user-changed')
        } else if (!state.currentUser) {
          commit('userLoggedIn', user)
          deQueue({ ...baseContext, uid: user.uid, isAnonymous: user.isAnonymous } as IFmAuthEventContext, 'logged-in')
        }
        commit('setCurrentUser', {
          isAnonymous: user.isAnonymous,
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified,
        })
      } else {
        commit('userLoggedOut')
        deQueue(
          {
            ...baseContext,
            uid: state.currentUser.uid,
            isAnonymous: state.currentUser.isAnonymous,
          } as IFmAuthEventContext,
          'logged-out',
        )
      }
    }
  },

  async watchRouteChanges({ dispatch, commit, rootState }) {
    if (configuration.onRouteChange) {
      const ctx: IFmEventContext = {
        Watch,
        Record,
        List,
        dispatch,
        commit,
        state: rootState,
      }
      deQueue(ctx, 'route-changed')
    }
  },
} as ActionTree<IFiremodelState, IRootState>

/**
 * deQueue
 *
 * pulls items off the lifecycle queue which match the lifecycle event
 */
async function deQueue<T extends IFmEventContext>(ctx: T, lifecycle: IFmLifecycleEvents) {
  const remainingQueueItems: IFmQueuedAction<T>[] = []
  const queued = ((ctx.state as any)['@firemodel'].queued as IFmQueuedAction<T>[]).filter(i => i.on === lifecycle)

  for (const item of queued) {
    try {
      const { cb } = item
      await cb(ctx)
    } catch (e) {
      console.error(`deQueing ${item.name}: ${e.message}`)
      ctx.commit('error', {
        message: e.message,
        code: e.code || e.name,
        stack: e.stack,
      })
      remainingQueueItems.push({ ...item, ...{ error: e.message, errorStack: e.stack } })
    }
  }

  ctx.commit('lifecycleEvent', {
    event: lifecycle,
    actionCallbacks: queued.filter(i => i.on === lifecycle).map(i => i.name),
  })
}
