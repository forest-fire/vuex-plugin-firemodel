import {
  IAbcAllQueryDefinition,
  AbcRequestCommand,
  AbcMutation,
  IQueryLocalResults,
  IQueryServerResults,
  QueryType
} from "../../../types";
import { AbcApi } from "../AbcApi";
import { getStore, AbcResult, IQueryOptions } from "../../..";
import get = require("lodash.get");
import { Record, List, IListOptions } from "firemodel";
import { deepEqual } from "fast-equals";
import { findPk } from "../shared/findPk";

let all = function all<T>(
  defn: Omit<IAbcAllQueryDefinition<T>, "queryType"> = {},
  options: IQueryOptions<T> = {}
) {
  const queryDefn: IAbcAllQueryDefinition<T> = {
    ...defn,
    queryType: QueryType.all
  };

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
        localPks: Array.from(new Set(vuexPks.concat(...indexedDbPks)))
      };
      const localResults = new AbcResult(ctx, {
        type: "query",
        queryDefn,
        local,
        options
      });

      if (idxRecords.length > 0) {
        store.commit(
          `${ctx.vuex.moduleName}/${AbcMutation.ABC_LOCAL_QUERY_TO_VUEX}`,
          localResults
        );
      } else {
        store.commit(
          `${ctx.vuex.moduleName}/${AbcMutation.ABC_LOCAL_QUERY_EMPTY}`,
          localResults
        );
      }
    } else {
      local = {
        records: vuexRecords,
        vuexPks,
        indexedDbPks: [],
        localPks: vuexPks
      } as IQueryLocalResults<T>;
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

    const response = new AbcResult(ctx, {
      type: "query",
      queryDefn,
      local,
      server,
      options
    });

    store.commit(
      `${ctx.vuex.moduleName}/${AbcMutation.ABC_FIREBASE_TO_VUEX_UPDATE}`,
      response
    );

    return response;
  };
};

all.prototype.isQueryHelper = true;

export { all };
