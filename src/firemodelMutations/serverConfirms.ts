import { MutationTree } from "vuex";
import { IDictionary } from "firemock";
import { FmCrudMutation } from "../types/mutations/FmCrudMutation";

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
export function serverConfirms<T = MutationTree<IDictionary>>(
  propOffset?: string
): MutationTree<T> {
  return {
    [FmCrudMutation.serverAddConfirm]() {
      //
    },

    [FmCrudMutation.serverChangeConfirm]() {
      console.log("server change confirmed");
    },

    [FmCrudMutation.serverRemoveConfirm]() {
      //
    }
  };
}
