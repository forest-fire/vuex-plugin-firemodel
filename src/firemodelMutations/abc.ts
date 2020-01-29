import { MutationTree } from "vuex";
import { changeRoot } from "../shared/changeRoot";
import { arrayToHash, hashToArray } from "typed-conversions";

import Vue from "vue";
import {
  AbcMutation,
  IDiscreteLocalResults,
  IDiscreteServerResults,
  IAbcVuexMeta
} from "../types";
import { IDictionary } from "common-types";

export function abc<T>(propOffset?: keyof T & string): MutationTree<T> {
  return {
    [AbcMutation.ABC_LOCAL_CACHE_UPDATE]<T extends IDictionary>(
      state: T,
      payload: IDiscreteLocalResults<any, T>
    ) {
      if (payload.moduleIsList) {
        Vue.set(state, payload.modulePostfix, payload.records);
      } else {
        if (!validResultSize(payload)) {
          return;
        }
        changeRoot<T>(state, payload.records[0], payload.vuexModuleName);
      }
    },

    [AbcMutation.ABC_INDEXED_SKIPPED]<T extends IDictionary>(
      state: T,
      payload: IDiscreteLocalResults<any>
    ) {
      // nothing to do; mutation is purely for debugging purposes
    },

    [AbcMutation.ABC_SERVER_UPDATE]<T extends IDictionary>(
      state: T,
      payload: IDiscreteServerResults<any>
    ) {
      if (payload.moduleIsList) {
        const currentList = state[payload.modulePostfix];
        const updated = hashToArray({
          ...arrayToHash(currentList),
          ...arrayToHash(payload.records)
        });
        Vue.set(state, payload.modulePostfix, updated);
      } else {
        if (!validResultSize(payload)) {
          return;
        }
      }
    },

    [AbcMutation.ABC_INDEXED_UPDATED]<T>(
      state: T,
      payload: IDiscreteServerResults<any>
    ) {
      // nothing to do; mutation is purely for debugging purposes
    }
  };
}

function validResultSize<T>(payload: IDictionary & IAbcVuexMeta<any>) {
  if (payload.records.length > 1) {
    console.warn(
      `There were ${payload.records.length} records in the payload of the ${AbcMutation.ABC_LOCAL_CACHE_UPDATE} mutation for the ${payload.vuexModuleName} Vuex module; this module is configured as for storage of a SINGULAR record not a list of records! This mutation will be ignored until this problem is corrected.`,
      payload.records
    );
    return false;
  }
  if (payload.records.length === 0) {
    console.warn(
      `There were zero records in the payload of the ${AbcMutation.ABC_LOCAL_CACHE_UPDATE} mutation for the ${payload.vuexModuleName} Vuex module! This mutation will be ignored; use the ${AbcMutation.ABC_MODULE_CLEARED} mutation if your intent is to remove state from a Vuex module with the ABC API.`
    );
    return false;
  }

  return true;
}
