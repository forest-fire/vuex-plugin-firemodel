import { AbcApi, AbcResult } from "@/abc";
import {
  AbcMutation,
  DbSyncOperation,
  IAbcResult,
  IDiscreteLocalResults,
  IDiscreteResult,
  IDiscreteServerResults,
  IAbcPayload
} from "@/types";
import { arrayToHash, hashToArray } from "typed-conversions";
import { changeRoot, get, updateList } from "@/util";

import { AbcError } from "@/errors";
import { IDictionary } from "common-types";
import { MutationTree } from "vuex";
import Vue from "vue";

export function AbcFiremodelMutation<T>(
  propOffset?: keyof T & string
): MutationTree<T> {
  const offset = !propOffset ? ("all" as keyof T & string) : propOffset;
  return {
    [AbcMutation.ABC_VUEX_UPDATE_FROM_IDX]<T extends IDictionary>(
      state: T,
      payload: AbcResult<any>
    ) {
      if (payload.vuex.isList) {
        Vue.set(state, payload.vuex.fullPath, payload.records);
      } else {
        // if (!validResultSize(payload)) {
        //   return;
        // }
        changeRoot<T>(state, payload.records[0], payload.vuex.moduleName);
      }
    },

    [AbcMutation.ABC_INDEXED_SKIPPED]<T extends IDictionary>(
      state: T,
      payload: IDiscreteLocalResults<any>
    ) {
      // nothing to do; mutation is purely for informational/debugging purposes
    },

    [DbSyncOperation.ABC_FIREBASE_SET_VUEX]<T extends IDictionary>(
      state: T,
      payload: IAbcPayload<T>
    ) {
      if (!payload.isList) {
        changeRoot<T>(state, payload.records[0], payload.localPath);
      } else {
        Vue.set(state, offset, payload.records);
      }
    },

    [DbSyncOperation.ABC_FIREBASE_SET_DYNAMIC_PATH_VUEX]<T extends IDictionary>(
      state: T,
      payload: IAbcPayload<T>
    ) {
      if (!payload.isList) {
        changeRoot<T>(
          state,
          dynamicPathSet(state, payload.records),
          payload.localPath
        );
      } else {
        Vue.set(state, offset, payload.records);
      }
    },

    [DbSyncOperation.ABC_FIREBASE_MERGE_VUEX]<T extends IDictionary>(
      state: T,
      payload: IAbcPayload<T>
    ) {
      if (!payload.isList) {
        // if (!validResultSize(payload, "server")) {
        //   return;
        // }
        changeRoot<T>(state, merge(state, payload.records), payload.localPath);
      } else {
        Vue.set(state, offset, payload.records);
      }
    },

    [DbSyncOperation.ABC_FIREBASE_SET_INDEXED_DB]<T>(
      state: T,
      payload: IAbcPayload<any>
    ) {
      // nothing to do; mutation is purely for informational/debugging purposes
    },

    [DbSyncOperation.ABC_FIREBASE_MERGE_INDEXED_DB]<T>(
      state: T,
      payload: IAbcPayload<T>
    ) {
      // nothing to do; mutation is purely for informational/debugging purposes
    },

    [DbSyncOperation.ABC_FIREBASE_SET_DYNAMIC_PATH_INDEXED_DB]<T>(
      state: T,
      payload: IAbcPayload<T>
    ) {
      // nothing to do; mutation is purely for informational/debugging purposes
    },

    [DbSyncOperation.ABC_INDEXED_DB_SET_VUEX]<T extends IDictionary>(
      state: T,
      payload: IAbcPayload<T>
    ) {
      if (!payload.isList) {
        if (process.env.NODE_ENV !== "production") {
          console.info(
            `You are using a query on a singular model ${payload.localPath}; this typically should be avoided.`
          );
        }
        changeRoot<T>(state, payload.records[0], payload.localPath);
      } else {
        if (!payload.isQuery) {
          throw new AbcError(
            `Attempt to use mutation ${DbSyncOperation.ABC_INDEXED_DB_SET_VUEX} with a discrete request.`,
            "not-allowed"
          );
        }
        Vue.set(state, offset, payload.records);
      }
    },

    [DbSyncOperation.ABC_INDEXED_DB_SET_DYNAMIC_PATH_VUEX]<
      T extends IDictionary
    >(state: T, payload: IAbcPayload<T>) {
      if (!payload.isList) {
        if (process.env.NODE_ENV !== "production") {
          console.info(
            `You are using a query on a singular model ${payload.localPath}; this typically should be avoided.`
          );
        }
        changeRoot<T>(state, payload.records[0], payload.localPath);
      } else {
        Vue.set(state, offset, payload.records);
      }
    },

    [DbSyncOperation.ABC_INDEXED_DB_MERGE_VUEX]<T extends IDictionary>(
      state: T,
      payload: IAbcPayload<T>
    ) {
      if (!payload.isList) {
        changeRoot<T>(state, payload.records[0], payload.localPath);
      } else {
        Vue.set(state, offset, payload.records);
      }
    },

    [AbcMutation.ABC_NO_CACHE]<T>(state: T, payload: IAbcPayload<T>) {
      // nothing to do; mutation is purely for informational/debugging purposes
    },
    [AbcMutation.ABC_LOCAL_QUERY_EMPTY]<T>(state: T, payload: IAbcPayload<T>) {
      // nothing to do; mutation is purely for informational/debugging purposes
    },

    [AbcMutation.ABC_PRUNE_STALE_IDX_RECORDS]<T extends IDictionary>(
      state: T,
      payload: { pks: string[]; vuex: AbcApi<T>["vuex"] }
    ) {
      // nothing to do; mutation is purely for informational/debugging purposes
    },

    [AbcMutation.ABC_PRUNE_STALE_VUEX_RECORDS]<T extends IDictionary>(
      state: T,
      payload: { pks: string[]; vuex: AbcApi<T>["vuex"] }
    ) {
      if (payload.vuex.isList) {
        const current: any[] = get(state, payload.vuex.modulePostfix, []);

        Vue.set(
          state,
          payload.vuex.modulePostfix,
          current.filter(i => !payload.pks.includes(i.id))
        );
      } else {
        changeRoot<T>(state, null, payload.vuex.moduleName);
      }
    }
  };
}

function validResultSize<T>(
  payload: IAbcPayload<T>,
  where: ("local" | "server") & keyof IAbcResult<T, any> = "server"
) {
  const records = payload.records;
  if (records.length > 1) {
    console.warn(
      `There were ${records.length} records in the payload of the ${AbcMutation.ABC_VUEX_UPDATE_FROM_IDX} mutation for the ${payload.localPath} Vuex module; this module is configured as for storage of a SINGULAR record not a list of records! This mutation will be ignored until this problem is corrected.`,
      records
    );
    return false;
  }
  if (records.length === 0) {
    console.warn(
      `There were zero records in the payload of the ${AbcMutation.ABC_VUEX_UPDATE_FROM_IDX} mutation for the ${payload.localPath} Vuex module! This mutation will be ignored; use the ${AbcMutation.ABC_MODULE_CLEARED} mutation if your intent is to remove state from a Vuex module with the ABC API.`
    );
    return false;
  }

  return true;
}
