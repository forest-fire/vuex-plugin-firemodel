import { IFmWatchEvent, Model } from 'firemodel';
import { changeRoot, isRecord, updateList } from '@/util';

import { FmCrudMutation } from '@/enums';
import { MutationTree } from 'vuex';

/**
 * **serverConfirms**
 *
 * When the client originates an event, it first triggers `local` mutations
 * as the first part of the "two phased commit", then when this action is
 * validated by the Firebase DB it sends a confirm message.
 *
 * The goal of this plugin for _rollbacks_ is to immediately change the state
 * back to what it had been before it had been optimistically set by the `local`
 * mutation.
 */
export function serverRollbacks<T extends Model>(propOffset?: keyof T & string): MutationTree<T> {
  // default to "all"
  const offset: keyof T & string = !propOffset ? ('all' as keyof T & string) : propOffset;

  return {
    [FmCrudMutation.serverAddRollback](state, payload: IFmWatchEvent<Model>) {
      if (isRecord(state, payload)) {
        changeRoot<T>(state, payload.value, payload.localPath);
      } else {
        updateList<T>(state, offset, payload.value);
      }
    },

    [FmCrudMutation.serverChangeRollback](state, payload: IFmWatchEvent<Model>) {
      if (isRecord(state, payload)) {
        changeRoot<T>(state, payload.value, payload.localPath);
      } else {
        updateList<T>(state, offset, payload.value);
      }
    },

    [FmCrudMutation.serverRemoveRollback](state, payload: IFmWatchEvent<Model>) {
      if (isRecord(state, payload)) {
        changeRoot<T>(state, payload.value, payload.localPath);
      } else {
        updateList<T>(state, offset, payload.value);
      }
    },
  };
}
