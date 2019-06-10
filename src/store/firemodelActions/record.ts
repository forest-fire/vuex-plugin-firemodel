import { ActionTree } from "vuex";
import { IFiremodelState, IGenericStateTree } from "../..";
import { FmEvents, IFmRecordEvent, IFMRecordEvent, Model, pathJoin } from "firemodel";
import get from "lodash.get";
import { FmCrudMutation } from "../../types/mutations/FmCrudMutation";
import { generateLocalId } from "..";
import { determineLocalStateNode } from "../../shared/determineLocalStateNode";

export const record: ActionTree<IFiremodelState, IGenericStateTree> = {
  [FmEvents.RECORD_CHANGED_LOCALLY]({ commit, rootState }, payload: IFmRecordEvent) {
    const payloadPlus = { ...payload, priorValue: get(rootState, payload.localPath) };
    commit(FmCrudMutation.changedLocally, payloadPlus);
    commit(`${payload.localPath}/CHANGED_LOCALLY`, payloadPlus, { root: true });
  },

  [FmEvents.RECORD_ADDED_LOCALLY]({ commit, rootState }, payload: IFmRecordEvent) {
    const payloadPlus = { ...payload, priorValue: get(rootState, payload.localPath) };
    commit(FmCrudMutation.addedLocally, payloadPlus);
    commit(determineLocalStateNode(payload, FmCrudMutation.addedLocally), payloadPlus, {
      root: true
    });
  },

  [FmEvents.RECORD_ADDED_CONFIRMATION]({ commit, state }, payload: IFmRecordEvent) {
    commit(FmCrudMutation.serverAddConfirm, payload);
    commit(determineLocalStateNode(payload, FmCrudMutation.serverAddConfirm), payload, {
      root: true
    });
  },

  [FmEvents.RECORD_ADDED]({ commit }, payload: IFmRecordEvent) {
    commit(determineLocalStateNode(payload, FmCrudMutation.serverAdd), payload, {
      root: true
    });
  },

  [FmEvents.RECORD_REMOVED]({ commit }, payload) {
    commit(determineLocalStateNode(payload, FmCrudMutation.serverRemove), payload, {
      root: true
    });
  },

  /**
   * The record has changed in an unstated way; this
   * type of event should typically come from a "value"
   * based event watcher on a record.
   */
  [FmEvents.RECORD_CHANGED](store, payload: IFmRecordEvent) {
    if (payload.watcherSource === "record") {
      console.log(determineLocalStateNode(payload, FmCrudMutation.serverChangeConfirm));
    }

    // 2nd phase of 2 phase commit
    store.commit(FmCrudMutation.serverChangeConfirm, payload);

    // Send mutation to appropriate state node
    this.commit(
      determineLocalStateNode(payload, FmCrudMutation.serverChangeConfirm),
      payload,
      {
        root: true
      }
    );
  }
};
