import { AbcApi, AbcResult, queryFirebase, queryIndexedDb, saveToIndexedDb } from '@/abc';
import type {
  AbcRequestCommand,
  IAbcOptions,
  IAbcQueryDefinition,
  IGeneralizedFiremodelQuery,
  IGeneralizedQuery,
  IQueryLocalResults,
  IQueryServerResults,
} from '@/types';
import { Model, Record } from 'firemodel';
import { getStore } from '@/util';
import { get } from 'native-dash';
import { AbcMutation, AbcStrategy, DbSyncOperation, QueryType } from '@/enums';

/**
 * A generalized flow for queries; specific query helpers
 * should use this flow to standarize their approach.
 */
export async function generalizedQuery<T extends Model>(
  queryDefn: IAbcQueryDefinition<T>,
  command: AbcRequestCommand,
  dexieQuery: IGeneralizedQuery<T>,
  firemodelQuery: IGeneralizedFiremodelQuery<T>,
  ctx: AbcApi<T>,
  options: IAbcOptions<T>
) {
  const store = getStore();
  const hasDynamicProperties = Record.dynamicPathProperties(ctx.model.constructor).length > 0;
  const vuexRecords = get<T[]>(store.state, ctx.vuex.fullPath.replace(/\//g, '.'), []);
  const vuexPks = vuexRecords.map((v) => Record.compositeKeyRef(ctx.model.constructor, v));

  let local: IQueryLocalResults<T, any> = {
    records: vuexRecords,
    vuexPks,
    indexedDbPks: [],
    localPks: vuexPks,
  };

  if (command === 'get' && ctx.config.useIndexedDb) {
    // Populate Vuex with what IndexedDB knows
    local = await queryIndexedDb(ctx.model.constructor, dexieQuery);
    const localResults = await AbcResult.create(ctx, {
      type: 'query',
      queryDefn,
      local,
      options,
    });

    if (local.records.length > 0) {
      if (hasDynamicProperties) {
        store.commit(
          `${ctx.vuex.moduleName}/${DbSyncOperation.ABC_INDEXED_DB_SET_DYNAMIC_PATH_VUEX}`,
          localResults
        );
      } else {
        store.commit(
          `${ctx.vuex.moduleName}/${DbSyncOperation.ABC_INDEXED_DB_SET_VUEX}`,
          localResults
        );
      }
    } else {
      store.commit(`${ctx.vuex.moduleName}/${AbcMutation.ABC_LOCAL_QUERY_EMPTY}`, localResults);
    }
  }

  let server: IQueryServerResults<T> | undefined;
  if (command === 'get' && options.strategy === AbcStrategy.getFirebase) {
    console.log(`${ctx.model.constructor.name}:start`);
    // get data from firebase
    queryFirebase(ctx, firemodelQuery, local).then(async (server) => {
      const serverResponse = await AbcResult.create(ctx, {
        type: 'query',
        queryDefn,
        local,
        server,
        options,
      });

      // cache results to IndexedDB
      if (ctx.config.useIndexedDb) {
        if (hasDynamicProperties) {
          // check queryType to determine what to do
          switch (queryDefn.queryType) {
            case QueryType.since:
            case QueryType.where:
              saveToIndexedDb(server, ctx.dexieTable);
              store.commit(
                `${ctx.vuex.moduleName}/${DbSyncOperation.ABC_FIREBASE_MERGE_INDEXED_DB}`,
                serverResponse
              );
              break;
            case QueryType.all:
              saveToIndexedDb(server, ctx.dexieTable);
              store.commit(
                `${ctx.vuex.moduleName}/${DbSyncOperation.ABC_FIREBASE_SET_DYNAMIC_PATH_INDEXED_DB}`,
                serverResponse
              );
              break;
          }
        } else {
          saveToIndexedDb(server, ctx.dexieTable);
          store.commit(
            `${ctx.vuex.moduleName}/${DbSyncOperation.ABC_FIREBASE_SET_INDEXED_DB}`,
            serverResponse
          );
        }
      }

      store.commit(
        `${ctx.vuex.moduleName}/${DbSyncOperation.ABC_INDEXED_DB_SET_VUEX}`,
        serverResponse
      );
    });

    // PRUNE
    /* const removeFromIdx = local.indexedDbPks.filter(i => !serverPks.includes(i));
    // Vuex at this point will have both it's old state and whatever IndexedDB
    // contributed
    const removeFromVuex = local.localPks.filter(i => !serverPks.includes(i));
  
    if (removeFromVuex.length > 0) {
      store.commit(
        `${ctx.vuex.moduleName}/${AbcMutation.ABC_PRUNE_STALE_VUEX_RECORDS}`,
        { pks: removeFromVuex, vuex: ctx.vuex }
      );
    }

    if (removeFromIdx.length > 0) {
      await ctx.dexieTable.bulkDelete(removeFromIdx);
      store.commit(
        `${ctx.vuex.moduleName}/${AbcMutation.ABC_PRUNE_STALE_IDX_RECORDS}`,
        { pks: removeFromIdx, vuex: ctx.vuex }
      );
    }
  
    server = {
      ...server,
      removeFromIdx,
      removeFromVuex
    }; */
  }

  const response = await AbcResult.create(ctx, {
    type: 'query',
    queryDefn,
    local,
    server,
    options,
  });

  store.commit(`${ctx.vuex.moduleName}/${DbSyncOperation.ABC_FIREBASE_SET_VUEX}`, response);

  return response;
}
