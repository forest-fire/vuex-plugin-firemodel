import { IFmWatchEvent, Model } from 'firemodel';

import { FmCrudMutation } from '@/enums';
import { MutationTree } from 'vuex';

/**
 * **serverConfirms**
 *
 * When the client originates an event, it first triggers `local` mutations
 * as the first part of the "two phased commit", then when this action is
 * validated by the Firebase DB it sends a confirm message.
 *
 * The goal of this plugin for _confirms_ is to do nothing more than handle the
 * event. If for some reason the consuming application wants to go further, they
 * may override the confirm funtions.
 */
export function serverConfirms<T extends Model>(propOffset?: keyof T): MutationTree<T> {
  return {
    [FmCrudMutation.serverAddConfirm](state, payload: IFmWatchEvent<Model>) {
      // console.log("server add confirmed", payload.value.id);
    },

    [FmCrudMutation.serverChangeConfirm](state, payload: IFmWatchEvent<Model>) {
      //
    },

    [FmCrudMutation.serverRemoveConfirm](state, payload: IFmWatchEvent<Model>) {
      // console.log("server remove confirmed", payload);
    },
  };
}
