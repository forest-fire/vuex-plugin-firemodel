import {
  IAbcAllQueryDefinition,
  AbcRequestCommand,
  AbcMutation,
  IQueryLocalResults,
  IQueryServerResults,
  IAbcQueryRequest
} from "../../../types";
import { AbcApi } from "../AbcApi";
import { getStore, AbcResult, IAbcResult, IQueryResult } from "../../..";
import get = require("lodash.get");
import { Record, List, IListOptions } from "firemodel";
import { deepEqual } from "fast-equals";
import { findPk } from "../shared/findPk";

let all = function all<T>(
  defn?: Omit<IAbcAllQueryDefinition<T>, "queryType">,
  options?: IListOptions<T>
) {
  return async (
    command: AbcRequestCommand,
    ctx: AbcApi<T>
  ): Promise<AbcResult<T>> => {
    const store = getStore();
    const vuexRecords = get<T[]>(
      store.state,
      ctx.vuex.fullPath.replace(/\//g, "."),
      []
    );
    const vuexPks = vuexRecords.map(v =>
      Record.compositeKeyRef(ctx.model.constructor, v)
    );

    let idxRecords: T[] = [];
    let local: IQueryLocalResults<T, any>;
    const vuexMeta = {
      vuexModuleName: ctx.vuex.fullPath,
      moduleIsList: ctx.config.isList || true,
      modulePostfix: ctx.vuex.modulePostfix || "all"
    };
    if (command === "get" && ctx.config.useIndexedDb) {
      // Populate Vuex with what IndexedDB knows
      idxRecords = await ctx.dexieList.all();
      const indexedDbPks = idxRecords.map(i =>
        Record.compositeKeyRef(ctx.model.constructor, i)
      );
      local = {
        records: idxRecords,
        vuexPks,
        indexedDbPks,
        localPks: Array.from(new Set(vuexPks.concat(...indexedDbPks))),
        ...vuexMeta
      };

      if (idxRecords.length > 0) {
        store.commit(AbcMutation.ABC_LOCAL_QUERY_TO_VUEX, {
          type: "query",
          local,
          vuex: this.vuex
        } as IQueryResult<T>);
      } else {
        store.commit(AbcMutation.ABC_LOCAL_QUERY_EMPTY, {
          local,
          vuex: this.vuex
        } as IQueryResult<T>);
      }
    } else {
      local = {
        records: vuexRecords,
        vuexPks,
        indexedDbPks: [],
        localPks: vuexPks,
        ...vuexMeta
      };
    }

    const serverRecords = (await List.all(ctx.model.constructor)).data;
    const serverPks = serverRecords.map(i =>
      Record.compositeKeyRef(ctx.model.constructor, i)
    );
    const newPks = serverPks.filter(i => !local.localPks.includes(i));
    const cacheHits: string[] = [];
    const stalePks: string[] = [];
    serverRecords.forEach(rec => {
      const pk = Record.compositeKeyRef(ctx.model.constructor, rec);
      if (!newPks.includes(pk)) {
        const localRec = findPk(pk, local.records);
        if (deepEqual(rec, localRec)) {
          cacheHits.push(pk);
        } else {
          stalePks.push(pk);
        }
      }
    });

    ctx.cachePerformance.hits = ctx.cachePerformance.hits + cacheHits.length;
    ctx.cachePerformance.misses =
      ctx.cachePerformance.misses + stalePks.length + newPks.length;

    const server: IQueryServerResults<T> = {
      records: serverRecords,
      serverPks,
      newPks,
      cacheHits,
      stalePks,
      overallCachePerformance: ctx.cachePerformance
    };

    const response: IAbcResult<T> = {
      type: "query",
      local,
      server,
      vuex: ctx.vuex
    };
    store.commit(AbcMutation.ABC_FIREBASE_TO_VUEX_UPDATE, response);

    return new AbcResult(ctx, response);
  };
};

all.prototype.isQueryHelper = true;

export { all };
