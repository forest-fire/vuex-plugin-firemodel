import { MutationTree } from 'vuex'
import { Model, IFmContextualizedWatchEvent, pathJoin } from 'firemodel'
import { IPathSetter } from 'abstracted-firebase'
import set from 'lodash.set'
import { IDictionary } from 'common-types'

const changeRoot = (state: IDictionary, newValues: IDictionary) => {
  Object.keys(newValues).forEach(v => {
    state[v] = newValues[v]
  })
  const removed = Object.keys(state).filter(k => !Object.keys(newValues).includes(k))
  Object.keys(removed).forEach(k => {
    delete state[k]
  })
  return state
}

export type ListPropertyCandidates<T> = Pick<T, { [K in keyof T]: T[K] extends Model[] ? K : never }[keyof T]>

export function recordMutations<T>(): MutationTree<T> {
  return {
    ADD(state, payload: IFmContextualizedWatchEvent<T> & { paths?: IPathSetter<T>[] }) {
      if (payload.value) {
        state = changeRoot(state, payload.value) as T
      } else if (payload.paths) {
        const value = payload.paths.reduce((prev, curr) => {
          const path = pathJoin(payload.localPath, curr.path)
          set(prev, path, curr.value)
          return prev
        }, {})
      }
    },
    CHANGED_LOCALLY(state, payload: IFmContextualizedWatchEvent<T> & { paths?: IPathSetter<T> }) {
      if (payload.value) {
        state = changeRoot(state, payload.value) as T
      } else if (payload.paths) {
        //@TODO
      }
    },
    CHANGED(state, payload: IFmContextualizedWatchEvent<T> & { paths?: IPathSetter<T> }) {
      if (payload.value) {
        state = changeRoot(state, payload.value) as T
      } else if (payload.paths) {
        //@TODO
      }
    },
    REMOVED(state, payload: IFmContextualizedWatchEvent) {
      //
    },
    RELATIONSHIP_ADDED(state, payload) {
      //
    },
    RELATIONSHIP_REMOVED(state, payload) {
      //
    },
  }
}
