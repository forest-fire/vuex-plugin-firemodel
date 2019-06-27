import { MutationTree } from "vuex";
import { IDictionary } from "firemock";
import { FmCrudMutation } from "../types/mutations/FmCrudMutation";
import { IFiremodelState } from "../types";
import { Model } from "firemodel";

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
export function serverConfirms<T extends Model>(
  propOffset?: keyof T
): MutationTree<T> {
  return {
    [FmCrudMutation.serverAddConfirm](state, payload) {
      console.log("server add confirmed", payload.value.id);
    },

    [FmCrudMutation.serverChangeConfirm](state, payload) {
      console.log("server change confirmed", payload.value.id);
    },

    [FmCrudMutation.serverRemoveConfirm](state, payload) {
      console.log("server remove confirmed", payload);
    }
  };
}
