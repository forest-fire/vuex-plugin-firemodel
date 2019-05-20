import {
  IFmWatchItem,
  IFmQueuedAction,
  IFiremodelState,
  IFmLifecycleEvents,
  IFmLocalChange,
  IFmEventActions,
} from './types'
import { IFirebaseConfig } from 'abstracted-firebase'
import { MutationTree } from 'vuex'
import { ICompositeKey, IFmRecordEvent } from 'firemodel'

const mutations = {
  configure: (state, config: IFirebaseConfig) => {
    state.config = config
  },
  connected(state) {
    state.status = 'connected'
  },
  connecting(state) {
    state.status = 'connecting'
  },
  connectionError(state, err: Error) {
    state.status = 'error'
    state.errors = state.errors ? state.errors.concat(err.message) : [err.message]
  },
  error(state, err) {
    if (!state.errors) {
      state.errors = []
    }
    state.errors.push(err.message)
  },
  clearErrors(state) {
    state.errors = []
  },

  pluginSetupComplete() {},

  setCurrentUser(state, user) {
    state.currentUser = {
      uid: user.uid,
      isAnonymous: user.isAnonymous,
      email: user.email,
      emailVerified: user.emailVerified,
    }
    state.authenticated = !user ? false : user.isAnonymous ? 'anonymous' : 'logged-in'
  },

  userLoggedOut(state) {
    state.currentUser = undefined
    state.authenticated = false
  },

  queue(state, item: IFmQueuedAction) {
    state.queued = state.queued.concat(item)
  },

  lifecycleEvent(state, event: { event: IFmLifecycleEvents; actionCallbacks: string[] }) {
    //
  },
  ADDED_LOCALLY(state, payload) {
    type payloadModel = typeof payload.modelConstructor
    const p: IFmRecordEvent<payloadModel> = payload
    state.localOnly = state.localOnly.concat({
      action: 'add',
      dbPath: p.dbPath,
      localPath: p.localPath,
      value: p.value,
      priorValue: p.priorValue,
      timestamp: new Date().getTime(),
    })
  },
  CHANGED_LOCALLY(state, payload) {
    type payloadModel = typeof payload.modelConstructor
    const p: IFmRecordEvent<payloadModel> = payload
    state.localOnly = state.localOnly.concat({
      action: 'update',
      dbPath: p.dbPath,
      localPath: p.localPath,
      value: p.value,
      priorValue: p.priorValue,
      timestamp: new Date().getTime(),
    })
  },
  SERVER_ADD_CONFIRMATION(state, payload) {
    state.localOnly = state.localOnly.filter(i => i.dbPath !== payload.dbPath)
  },
  SERVER_CHANGE_CONFIRMATION(state, payload) {
    state.localOnly = state.localOnly.filter(i => i.dbPath !== payload.dbPath)
  },
  WATCHER_STARTED(state, payload: IFmWatchItem) {
    state.watching = state.watching.concat(payload)
  },
} as MutationTree<IFiremodelState>

export function generateLocalId(compositeKey: ICompositeKey, action: IFmEventActions) {
  // return createCompositeKeyString(compositeKey) + '-' + action
  return action
}

const mutationTypes = Object.keys(mutations).filter(i => typeof i !== 'function')
export type IFmConfigMutationTypes = keyof typeof mutationTypes

export default mutations
